# 🛡️ Frontend Security & Functionality Audit Report
**Project:** Keshar Jewellers - E-Commerce Platform
**Auditor:** Senior Frontend Developer Agent

As requested, I have conducted a deep, read-only analysis of the frontend codebase, focusing on security, data flow, API integration, and overall functionality. Here are the critical weaknesses and vulnerabilities found, ordered by severity.

---

## 🔴 CRITICAL SEVERITY (Fix Immediately)

### 1. XSS Vulnerability: Insecure JWT Token Storage
**File:** `src/context/AuthContext.tsx` (Lines 61, 104, 137)
**Issue:** The authentication JWT token is stored in `localStorage` (`localStorage.setItem("keshar_auth_token", ...)`). 
**Risk:** If there is *any* Cross-Site Scripting (XSS) vulnerability on the website (e.g., in product descriptions, user reviews, or third-party scripts), a hacker can easily run a script to steal all users' tokens from `localStorage` and hijack their sessions.
**Recommendation:** Move the token to an `httpOnly`, `Secure` cookie. This prevents JavaScript from accessing the token entirely.

### 2. Broken Authentication on Critical API Calls
**File:** `src/lib/api.ts` (Functions: `updateProductApi`, `createRazorpayOrderApi`, `updateOrderTrackingApi`)
**Issue:** The frontend `api.ts` file makes calls to protected backend routes (like updating products or creating orders), but it **never attaches the JWT token** to the headers. 
**Risk:** 
- If the backend is secure, these API calls will simply fail with `401 Unauthorized` for logged-in users.
- If the backend is *not* checking for the token, anyone can send a POST request to update products or track orders without being logged in (Massive IDOR vulnerability).
**Recommendation:** `api.ts` needs to retrieve the token from the user session and inject `Authorization: Bearer <token>` into the headers for all protected routes.

---

## 🟠 HIGH SEVERITY (Major Risks)

### 3. Open Redirect Vulnerability in Login Flow
**File:** `src/app/login/page.tsx` (Line 15, 50)
**Issue:** The login page takes a `redirect` query parameter (`searchParams.get("redirect")`) and directly pushes it to the router after login (`router.push(redirectUrl)`).
**Risk:** Attackers can craft phishing links like `kesharjewellers.com/login?redirect=https://evil-hacker-site.com`. The user logs in on the real site but is immediately redirected to a fake site that looks identical to steal their payment info.
**Recommendation:** Sanitize the redirect URL. Ensure it starts with `/` and is a relative path before redirecting.

### 4. Client-Side Price Calculation (Checkout Tampering)
**File:** `src/components/checkout/CheckoutModal.tsx` (Line 99)
**Issue:** The `finalAmount` is calculated on the frontend and sent directly to the Razorpay order creation API (`createRazorpayOrderApi(finalAmount)`).
**Risk:** A tech-savvy user can intercept the frontend request or use Chrome DevTools to change `finalAmount` to `₹1` and buy expensive gold jewellery for free. 
**Recommendation:** The frontend should only send the `cartItems` and `giftId`. The **backend must recalculate** the total price using the database prices before creating the Razorpay order. 

---

## 🟡 MEDIUM SEVERITY (Functionality & UX Bugs)

### 5. Dangerous Fallback API Logic
**File:** `src/lib/api.ts` (Function: `safePost`, Line 204)
**Issue:** For POST requests (like payments and orders), if the primary backend times out (even if it actually processed the data), the frontend blindly retries the request on the fallback backend.
**Risk:** This can result in **duplicate orders** or **duplicate payment initialization** if the first request succeeded on the server but the network response was slow.
**Recommendation:** Use idempotency keys for POST requests, or only use fallback URLs for `GET` requests, not data mutations.

### 6. Missing Strict Phone Number Validation
**File:** `src/components/checkout/CheckoutModal.tsx` (Line 406)
**Issue:** The checkout form relies on a basic `<input type="tel" required />`. I noticed a new `inputValidation.ts` was created recently, but it is **not being used** in the checkout modal.
**Risk:** Users can enter invalid phone numbers (e.g., "123", letters, or foreign numbers), which will cause delivery failures and OTP issues.
**Recommendation:** Integrate the strict 10-digit Indian phone number schema validator from `inputValidation.ts` into the checkout form.

### 7. Backend Error Information Disclosure
**File:** `src/components/checkout/CheckoutModal.tsx` (Line 124)
**Issue:** If the backend throws an error during Razorpay order creation, the frontend directly sets `res?.error` to the UI (`setErrorMsg`).
**Risk:** If the backend accidentally sends a MongoDB stack trace or raw SQL error, the user (or hacker) will see internal system details.
**Recommendation:** Wrap this in a generic fallback message or ensure the new `errorHandler.ts` is sanitizing these messages before they reach the UI state.

---

### 👨‍💻 Summary Note to User:
Aapki website ka UI aur components bahut premium hain, lekin **API Security aur Token Management** me major flaws hain. Sabse bada khatra `api.ts` me auth headers ka na hona aur checkout me price frontend se bhejna hai. 

Maine abhi koi file change nahi ki hai jaisa aapne kaha tha. Please review this report. Agar aap chahte hain ki main in weaknesses ko ek-ek karke fix karu (jaise Token security ya API headers), toh mujhe bataiye!
