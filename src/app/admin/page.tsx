"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, STORE_CATEGORIES } from "@/frontend/types/product";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"bulk" | "single" | "manage">("bulk");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Bulk CSV state
  const [parsedCsvProducts, setParsedCsvProducts] = useState<Product[]>([]);
  const [csvFileName, setCsvFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Single Product Form state
  const [formData, setFormData] = useState({
    category: "nose-pins",
    productType: "",
    description: "",
    material: "92.50 % silver",
    dimensionL: "8mm",
    dimensionW: "8mm",
    dimensionH: "7mm",
    weight: "",
    sellingPrice: "",
    mrp: "",
    frontImage: "",
    backImage: "",
    modelImage: "",
  });

  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Notification helper
  const showToast = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 1. Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const headers = [
      "Product Category",
      "Product Type",
      "Description",
      "Product Material",
      "Dimension L",
      "Dimension W",
      "Dimension H",
      "Product Weight",
      "Selling Price",
      "MRP",
      "Front Image",
      "Back Image",
      "Model Image",
    ];

    const sampleRows = [
      [
        "nose-pins",
        "noz pin",
        "silver Black+AD STONE pic 20",
        "92.50 % silver",
        "8mm",
        "8mm",
        "7mm",
        "0.640mg",
        "540",
        "756",
        "/images/products/silver-ad-nose-pin.jpg",
        "/images/products/silver-ad-rhombus-earring-back.png",
        "/images/products/silver-ad-nose-pin.jpg",
      ],
      [
        "earrings",
        "92.5 Silver Studs",
        "Pure 92.5% Silver Micro-Pave AD Stone Geometric Rhombus Stud Earring",
        "92.50% Pure Sterling Silver",
        "10mm",
        "10mm",
        "8mm",
        "1.850g",
        "700",
        "999",
        "/images/products/silver-ad-rhombus-earring.jpg",
        "/images/products/silver-ad-rhombus-earring-back.png",
        "/images/products/silver-ad-rhombus-earring.jpg",
      ],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...sampleRows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join(
        "\n"
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "keshar_jewellers_product_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Parse uploaded CSV
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          showToast("error", "CSV file is empty or missing data rows.");
          return;
        }

        // Parse CSV lines handling quoted fields
        const parseLine = (line: string): string[] => {
          const result: string[] = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === "," && !inQuotes) {
              result.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const dataRows = lines.slice(1);
        const parsed: Product[] = [];

        dataRows.forEach((rowStr, idx) => {
          const cols = parseLine(rowStr);
          if (cols.length >= 8 && cols[0]) {
            parsed.push({
              id: `csv-${Date.now()}-${idx}`,
              category: cols[0].toLowerCase().trim().replace(/\s+/g, "-"),
              productType: cols[1] || "Jewellery",
              description: cols[2] || "",
              material: cols[3] || "92.50 % silver",
              dimensionL: cols[4] || "N/A",
              dimensionW: cols[5] || "N/A",
              dimensionH: cols[6] || "N/A",
              weight: cols[7] || "N/A",
              sellingPrice: parseFloat(cols[8]) || 0,
              mrp: parseFloat(cols[9]) || 0,
              frontImage: cols[10] || "/images/products/silver-ad-nose-pin.jpg",
              backImage: cols[11] || cols[10] || "/images/products/silver-ad-rhombus-earring-back.png",
              modelImage: cols[12] || cols[10] || "/images/products/silver-ad-nose-pin.jpg",
              createdAt: new Date().toISOString(),
            });
          }
        });

        if (parsed.length === 0) {
          showToast("error", "No valid product rows could be read from this CSV.");
        } else {
          setParsedCsvProducts(parsed);
          showToast("success", `Parsed ${parsed.length} products! Review below and click Upload.`);
        }
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to parse CSV file. Please check format.");
      }
    };

    reader.readAsText(file);
  };

  // 3. Submit Bulk CSV Products to API
  const handleSaveBulkCsv = async () => {
    if (parsedCsvProducts.length === 0) return;
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedCsvProducts),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `🎉 Successfully uploaded ${parsedCsvProducts.length} products to your store!`);
        setParsedCsvProducts([]);
        setCsvFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchProducts();
      } else {
        showToast("error", data.error || "Failed to save products.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Image Uploader for Single Form
  const handleUploadImageFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: "frontImage" | "backImage" | "modelImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(fieldKey);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, [fieldKey]: data.url }));
        showToast("success", `${fieldKey.replace("Image", "")} image uploaded!`);
      } else {
        showToast("error", data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to upload file");
    } finally {
      setUploadingImage(null);
    }
  };

  // 5. Submit Single Product Form
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productType || !formData.sellingPrice) {
      showToast("error", "Please fill in Product Type and Selling Price.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sellingPrice: Number(formData.sellingPrice),
          mrp: Number(formData.mrp) || Number(formData.sellingPrice),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Product published successfully!");
        setFormData({
          category: formData.category,
          productType: "",
          description: "",
          material: "92.50 % silver",
          dimensionL: "8mm",
          dimensionW: "8mm",
          dimensionH: "7mm",
          weight: "",
          sellingPrice: "",
          mrp: "",
          frontImage: "",
          backImage: "",
          modelImage: "",
        });
        await fetchProducts();
      } else {
        showToast("error", data.error || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "API request failed");
    } finally {
      setLoading(false);
    }
  };

  // 6. Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Product removed.");
        await fetchProducts();
      } else {
        showToast("error", data.error || "Delete failed.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "API error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#35191C] p-4 sm:p-8 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Navbar for Admin */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-[#E8CFC5] gap-4">
          <div>
            <span className="text-[#C77D62] uppercase tracking-[0.25em] text-xs font-bold block">
              Keshar Jewellers Management
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#9B1B30] tracking-tight">
              Product Upload &amp; Catalog Center
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-[#FFF0EA] hover:bg-[#FFE2D8] border border-[#E8CFC5] text-[#35191C] text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
            >
              ← View Store
            </Link>
            <span className="px-3 py-1 bg-[#B82E44] text-[#FFF8F0] text-xs font-bold rounded-lg shadow-sm">
              {products.length} Products Active
            </span>
          </div>
        </div>

        {/* Toast Alert */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-medium transition-all ${
              statusMessage.type === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-[#E8CFC5] pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "bulk"
                ? "bg-[#B82E44] text-[#FFF8F0] shadow-sm"
                : "bg-[#FFF0EA] text-[#6F4A4A] border border-[#E8CFC5] hover:border-[#B82E44]"
            }`}
          >
            ⚡ Fast Bulk Excel / CSV Upload
          </button>
          <button
            onClick={() => setActiveTab("single")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "single"
                ? "bg-[#B82E44] text-[#FFF8F0] shadow-sm"
                : "bg-[#FFF0EA] text-[#6F4A4A] border border-[#E8CFC5] hover:border-[#B82E44]"
            }`}
          >
            ➕ Quick Single Product Form
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "manage"
                ? "bg-[#B82E44] text-[#FFF8F0] shadow-sm"
                : "bg-[#FFF0EA] text-[#6F4A4A] border border-[#E8CFC5] hover:border-[#B82E44]"
            }`}
          >
            📋 Manage Live Catalog ({products.length})
          </button>
        </div>

        {/* TAB 1: BULK CSV / EXCEL UPLOAD */}
        {activeTab === "bulk" && (
          <div className="space-y-8">
            {/* Step-by-Step Instructions & Template Download */}
            <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8CFC5]">
                <div>
                  <h2 className="font-serif text-2xl text-[#9B1B30] mb-1">
                    Upload Multiple Products At Once
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6F4A4A]">
                    Fill in your products in Excel or Google Sheets using the 11 required columns, save as CSV, and upload here.
                  </p>
                </div>
                <button
                  onClick={handleDownloadSampleCsv}
                  className="px-5 py-2.5 bg-[#480C14] hover:bg-[#7C1B2A] text-[#E6C766] border border-[#D4AF37]/50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <span>📥</span>
                  <span>Download Sample CSV Template</span>
                </button>
              </div>

              {/* Quick Links for Client / Drive */}
              <div className="mt-4 p-4 rounded-xl bg-[#FFF0EA] border border-[#E8CFC5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#7A1021] flex items-center gap-1.5">
                    ?? Connected Drive & Google Sheets (Account: free1himansh@gmail.com)
                  </span>
                  <span className="text-[#6F4A4A]">
                    Use these direct links to share the product data sheet and image upload folder with your client.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <a
                    href="https://docs.google.com/spreadsheets/d/1fC5VP_foYOq69iE-zYNf-Yd6Nhs7ubjBhrY3sV_jMY8/edit?gid=0#gid=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#0F9D58] hover:bg-[#0B8043] text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    ?? Open Google Sheet
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/1jJgSH7CxYJYTRCgrewZ16ux0G2rA7dc4?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    ?? Open Drive Folder
                  </a>
                </div>
              </div>

              {/* 11 Mandatory Columns Legend */}
              <div className="mt-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B82E44] block mb-3">
                  All 11 Mandatory Columns Included in Template:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">1. Product Category</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. nose-pins, earrings</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">2. Product Type</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. noz pin, stud</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">3. Description</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. silver Black+AD STONE</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">4. Product Material</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 92.50 % silver</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">5. Dimension L</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 8mm</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">6. Dimension W</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 8mm</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">7. Dimension H</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 7mm</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">8. Product Weight</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 0.640mg</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">9. Selling Price</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 540</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">10. MRP</span>
                    <span className="text-[10px] text-[#6F4A4A]">e.g. 756</span>
                  </div>
                  <div className="p-2.5 bg-[#FFF0EA] rounded-lg border border-[#E8CFC5]">
                    <span className="font-bold text-[#35191C] block">11. 3 Images</span>
                    <span className="text-[10px] text-[#6F4A4A]">Front, Back, Model</span>
                  </div>
                </div>
              </div>

              {/* Drag & Drop File Upload Box */}
              <div className="mt-8">
                <label className="border-2 border-dashed border-[#B82E44]/40 hover:border-[#B82E44] bg-[#FFF0EA]/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                  <div className="w-14 h-14 rounded-full bg-[#B82E44]/10 text-[#B82E44] flex items-center justify-center text-2xl mb-3">
                    📄
                  </div>
                  <span className="font-serif text-lg text-[#9B1B30] font-medium block mb-1">
                    {csvFileName ? `Selected: ${csvFileName}` : "Click to select or drag & drop CSV file"}
                  </span>
                  <span className="text-xs text-[#6F4A4A]">
                    Uploads any number of products directly into all categories
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Parsed Preview Table */}
            {parsedCsvProducts.length > 0 && (
              <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#9B1B30]">
                      Preview: {parsedCsvProducts.length} Products Ready to Publish
                    </h3>
                    <p className="text-xs text-[#6F4A4A]">
                      Review the data below. Click &quot;Upload &amp; Publish All&quot; to insert into the store.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveBulkCsv}
                    disabled={loading}
                    className="px-6 py-3 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Publishing..." : `🚀 Upload & Publish All (${parsedCsvProducts.length})`}
                  </button>
                </div>

                <div className="overflow-x-auto border border-[#E8CFC5] rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#7C1B2A] text-[#E6C766]">
                        <th className="p-3 border-b border-[#E8CFC5]/20">Category</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">Type</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">Description</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">Material</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">Dimensions (LxWxH)</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">Weight</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">Selling Price</th>
                        <th className="p-3 border-b border-[#E8CFC5]/20">MRP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8CFC5]/50 bg-white">
                      {parsedCsvProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[#FFF8F0] transition-colors">
                          <td className="p-3 font-semibold text-[#B82E44]">{p.category}</td>
                          <td className="p-3 font-medium">{p.productType}</td>
                          <td className="p-3 max-w-xs truncate">{p.description}</td>
                          <td className="p-3">{p.material}</td>
                          <td className="p-3">{p.dimensionL} x {p.dimensionW} x {p.dimensionH}</td>
                          <td className="p-3 font-medium">{p.weight}</td>
                          <td className="p-3 font-bold text-[#B82E44]">₹{p.sellingPrice}</td>
                          <td className="p-3 text-[#6F4A4A]/60 line-through">₹{p.mrp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUICK SINGLE PRODUCT FORM */}
        {activeTab === "single" && (
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)] max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl text-[#9B1B30] mb-1">
              Add Single Product (15 Seconds)
            </h2>
            <p className="text-xs sm:text-sm text-[#6F4A4A] mb-8">
              Fill all 11 specifications and upload photos. Product is instantly added to its category.
            </p>

            <form onSubmit={handleSingleSubmit} className="space-y-6">
              {/* Row 1: Category & Product Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                    1. Product Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  >
                    {STORE_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                    2. Product Type * (e.g. noz pin, stud)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="noz pin"
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                </div>
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                  3. Description * (No Title, only description)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="silver Black+AD STONE pic 20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                />
              </div>

              {/* Row 3: Material & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                    4. Product Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="92.50 % silver"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                    8. Product Weight * (mg / gram)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0.640mg miligram"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                </div>
              </div>

              {/* Row 4: Dimensions (L, W, H) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                  5, 6, 7. Dimensions (Length, Width, Height) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="L: 8mm"
                    value={formData.dimensionL}
                    onChange={(e) => setFormData({ ...formData, dimensionL: e.target.value })}
                    className="p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                  <input
                    type="text"
                    placeholder="W: 8mm"
                    value={formData.dimensionW}
                    onChange={(e) => setFormData({ ...formData, dimensionW: e.target.value })}
                    className="p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                  <input
                    type="text"
                    placeholder="H: 7mm"
                    value={formData.dimensionH}
                    onChange={(e) => setFormData({ ...formData, dimensionH: e.target.value })}
                    className="p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                </div>
              </div>

              {/* Row 5: Pricing (Selling Price & MRP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                    9. Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="540"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44] font-bold text-[#B82E44]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-1.5">
                    10. MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="756"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full p-3 bg-[#FFF0EA]/40 border border-[#E8CFC5] rounded-xl text-sm focus:outline-none focus:border-[#B82E44]"
                  />
                </div>
              </div>

              {/* Row 6: 3 Images (Front, Back, Model) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35191C] mb-2">
                  11. 3 Images (Front Image, Back Image, Model Image)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Front Image */}
                  <div className="border border-[#E8CFC5] bg-[#FFF0EA]/30 rounded-xl p-3 text-center">
                    <span className="text-xs font-bold text-[#35191C] block mb-2">① Front View</span>
                    {formData.frontImage ? (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border">
                        <Image src={formData.frontImage} alt="Front preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-[#E8CFC5]/30 flex items-center justify-center text-xs text-[#6F4A4A] mb-2">
                        No image
                      </div>
                    )}
                    <label className="block px-3 py-1.5 bg-[#B82E44] text-[#FFF8F0] text-[11px] font-semibold rounded-lg cursor-pointer hover:bg-[#7C1B2A] transition-all">
                      {uploadingImage === "frontImage" ? "Uploading..." : "Upload Front"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageFile(e, "frontImage")}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Back Image */}
                  <div className="border border-[#E8CFC5] bg-[#FFF0EA]/30 rounded-xl p-3 text-center">
                    <span className="text-xs font-bold text-[#35191C] block mb-2">② Back / 925 Stamp</span>
                    {formData.backImage ? (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border">
                        <Image src={formData.backImage} alt="Back preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-[#E8CFC5]/30 flex items-center justify-center text-xs text-[#6F4A4A] mb-2">
                        No image
                      </div>
                    )}
                    <label className="block px-3 py-1.5 bg-[#B82E44] text-[#FFF8F0] text-[11px] font-semibold rounded-lg cursor-pointer hover:bg-[#7C1B2A] transition-all">
                      {uploadingImage === "backImage" ? "Uploading..." : "Upload Back"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageFile(e, "backImage")}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Model Image */}
                  <div className="border border-[#E8CFC5] bg-[#FFF0EA]/30 rounded-xl p-3 text-center">
                    <span className="text-xs font-bold text-[#35191C] block mb-2">③ Model Wear View</span>
                    {formData.modelImage ? (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border">
                        <Image src={formData.modelImage} alt="Model preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-[#E8CFC5]/30 flex items-center justify-center text-xs text-[#6F4A4A] mb-2">
                        No image
                      </div>
                    )}
                    <label className="block px-3 py-1.5 bg-[#B82E44] text-[#FFF8F0] text-[11px] font-semibold rounded-lg cursor-pointer hover:bg-[#7C1B2A] transition-all">
                      {uploadingImage === "modelImage" ? "Uploading..." : "Upload Model"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageFile(e, "modelImage")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-[#FFF8F0] text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Product to Store"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MANAGE PRODUCTS CATALOG */}
        {activeTab === "manage" && (
          <div className="bg-[#FFFDFC] border border-[#E8CFC5] rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(72,12,20,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl text-[#9B1B30]">
                  Live Products Catalog ({products.length})
                </h3>
                <p className="text-xs text-[#6F4A4A]">
                  All active products across categories. Changes reflect immediately on the website.
                </p>
              </div>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-[#FFF0EA] border border-[#E8CFC5] text-xs font-semibold rounded-lg hover:bg-[#FFE2D8] transition-all"
              >
                🔄 Refresh
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 text-[#6F4A4A]">
                No products found. Use Bulk Upload or Single Form to add products.
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#E8CFC5] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#7C1B2A] text-[#E6C766]">
                      <th className="p-3 border-b border-[#E8CFC5]/20">Photo</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Category</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Type</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Description</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Material</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Dimensions</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Weight</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20">Price</th>
                      <th className="p-3 border-b border-[#E8CFC5]/20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8CFC5]/50 bg-white">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FFF8F0] transition-colors">
                        <td className="p-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#E8CFC5] bg-[#FFF0EA]">
                            <Image
                              src={p.frontImage || "/images/placeholder.jpg"}
                              alt={p.productType}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/products/${p.category}`}
                            target="_blank"
                            className="font-bold text-[#B82E44] hover:underline"
                          >
                            {p.category} ↗
                          </Link>
                        </td>
                        <td className="p-3 font-medium">{p.productType}</td>
                        <td className="p-3 max-w-xs truncate">{p.description}</td>
                        <td className="p-3">{p.material}</td>
                        <td className="p-3">{p.dimensionL}x{p.dimensionW}x{p.dimensionH}</td>
                        <td className="p-3 font-medium">{p.weight}</td>
                        <td className="p-3">
                          <span className="font-bold text-[#B82E44]">₹{p.sellingPrice}</span>
                          {p.mrp && <span className="text-[10px] text-[#6F4A4A]/50 block line-through">₹{p.mrp}</span>}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-semibold transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
