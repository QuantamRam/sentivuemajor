# SentiVue

> **A Major Project submitted to Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology**

SentiVue is an enterprise-grade AI sentiment analysis platform that enables users to perform bulk sentiment analysis on large datasets using powerful machine learning models. Built to deliver quick, reliable, and entirely local inference, SentiVue empowers you to extract real-time emotional insights and aspect-based keywords from complex textual data without incurring API costs.

---

## 🌟 Key Features

- **🧠 Local AI Inference:** Runs cutting-edge natural language processing (NLP) models locally in the browser via WebGL/WebGPU and backend server modules—ensuring user data stays private and secure.
- **📁 Bulk CSV Analysis:** Instantly analyze large datasets by uploading CSV files. Automatically parses, analyzes, and returns consolidated sentiment scores.
- **📊 Interactive Dashboard:** Visualize insights with dynamic, interactive charts (Recharts framework) including pie charts for sentiment distribution, confidence sliders, and timeline views.
- **🔑 Aspect-based Keyword Extraction:** Extracts context-aware keywords and topics from text, pinpointing exactly *what* subjects are driving positive or negative sentiments.
- **📄 Professional PDF Reports:** Generate and download comprehensive enterprise-grade PDF status reports summarizing sentimental trends with a single click.
- **🌗 Modern UI/UX:** A fully responsive, accessible, dark-mode compatible interface built with React, Tailwind CSS, and shadcn/ui.

---

## 🛠️ Technology Stack

**Frontend Framework:**
- **React.js** (v18)
- **Vite** (Build Tool + SWC)
- **TypeScript**

**Styling & UI Components:**
- **Tailwind CSS** (v3)
- **shadcn/ui** (Radix UI Primitives)
- **Framer Motion** (Animations)
- **Lucide React** (Iconography)

**Data Visualization & Export:**
- **Recharts** (Interactive Charts)
- **jsPDF & html2canvas** (Report Generation)
- **PapaParse** (CSV Parsing)

**Backend & ML Pipeline (Python):**
- **Python** backend server 
- **HuggingFace Transformers / Local ML Pipeline** (Sentiment Classification & Keyword Extraction)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (or equivalent package manager like yarn/bun/pnpm)
- **Python:** v3.8+ (for configuring the backend ML server)

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sentivue.git
cd sentivue
```

### 2. Frontend Setup
Install the necessary Node.js dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
*(Optional) Create a virtual environment:*
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install backend requirements (ensure `requirements.txt` is present or install needed ML libraries):
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
python server.py
# The ML pipeline will be initialized dynamically
```

---

## 🎯 Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Ensure your backend server is running on the correct port if performing heavy aspect-based keyword extraction.
3. Import a CSV file containing textual data using the dropzone.
4. View the generated interactive charts and sentiment timelines.
5. Click "Export PDF" to obtain your formal results document. 

---

## 🏫 Academic Context

This project is developed as the Final Year Bachelor of Technology (B.Tech) Major Project for **Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology**. 

The goal of this project is to showcase full-stack development, modern deployment lifecycles, and applied Machine Learning through a comprehensive web application.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
