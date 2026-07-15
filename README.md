# VedaScan 🌿 — Ayurvedic Remedy Recommendations & Wellness Center

> A highly polished, interactive, personalized Ayurvedic medicine, herb, and wellness recommendation system designed to guide users on their journey toward optimal holistic health.

**🔗 Live App on AI Studio:** [vedascan.ai.studio](https://vedascan.ai.studio)

VedaScan uses deep Ayurvedic principles to analyze your symptoms, health conditions, or Dosha profiles (Prakriti), recommending natural remedies, dietary guides, and lifestyle modifications powered by safe, expert-curated wellness structures and integrated AI models.

---

## ⭐️ Key Features

### 1. 📋 Interactive Dosha (Prakriti) Assessment
- Take a comprehensive, multi-step diagnostic test to identify your primary constitution (**Vata**, **Pitta**, or **Kapha**).
- Gain instant, detailed breakdowns of physical characteristics, psychological tendencies, and metabolic behaviors corresponding to your dominant energies.

### 2. 🔍 Real-Time Symptom & Herb Analyzer
- Match your specific health conditions, discomforts, or wellness goals with time-tested Ayurvedic ingredients, herbs, and classical formulations.
- Explore an extensive herbal catalog complete with botanical profiles, historical clinical applications, thermal attributes (*Virya*), taste profiles (*Rasa*), and post-digestive effects (*Vipaka*).

### 3. 🤖 Smart Ayurvedic Consultation (AyurBot)
- Engage with a secure, highly trained conversational assistant contextually calibrated to Ayurvedic science.
- Prompt clinical queries regarding diet, daily routines (*Dinacharya*), seasonal adaptation (*Ritucharya*), and custom detoxification guidelines.

### 4. 📈 Tailored Wellness Plans & Logs
- Create and maintain personal profile profiles, save recommended herbal formulations directly to your dashboard, and track chronic wellness notes.
- Receive dynamic meal recommendations and therapeutic advice specific to your ongoing imbalances (*Vikriti*).

---

## 🛠️ Technology Stack

- **Frontend:** React 18+, Vite, Tailwind CSS, Lucide Icons, and Motion (for physics-smooth, staggered fluid transitions).
- **Backend:** Express (Node.js engine running standalone or behind robust reverse proxy servers).
- **AI Engine:** Google Gemini AI Node SDK (configured securely for server-side inference, keeping keys safely masked from the client browser).
- **Type Safety:** 100% Strict TypeScript for reliable data models and robust structural consistency.

---

## 🚀 Quick Start & Local Development

This repository contains everything you need to compile, run, and experiment with VedaScan locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or newer) installed on your system.

### 1. Install Dependencies
Clone the repository and install the initial package dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy or rename `.env.example` to `.env` in the root directory and add your secret credentials:
```env
# .env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Security Note:** Never expose the `GEMINI_API_KEY` to client-side files or bundles. It is consumed strictly on the server-side proxy routes.

### 3. Launch Development Server
Boot up the full-stack server locally (Vite and Express concurrently):
```bash
npm run dev
```
The application will immediately bind and become accessible at:
👉 **`http://localhost:3000`**

### 4. Compile Production Build
To bundle the frontend bundle and compile the TypeScript backend entrypoint into optimized static files:
```bash
npm run build
```
To launch the production server from the compiled assets:
```bash
npm run start
```

---

## 🔒 Copyright & Intellectual Property

VedaScan is registered and cryptographically signed under the academic portfolio registry.
- **Primary Developer & Author:** Ethan Aarav Gomez
- **Registered Session:** `ethanaaravgomez@gmail.com`
- **Academic Context:** Sastra Deemed University / Verified Academic Software Registry
- **License:** All Rights Reserved. No unauthorized duplication, sublicensing, or reassignment of intellectual property is permitted under global digital asset framework regulations.
