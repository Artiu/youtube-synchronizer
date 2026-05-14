# 📺 YouTube Synchronizer

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![SolidJS](https://img.shields.io/badge/SolidJS-2C4F7C?logo=solid&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

A browser extension that allows you to watch YouTube videos together with friends in real-time, synchronized across multiple devices.

📥 **[Install from Chrome Web Store](https://chromewebstore.google.com/detail/youtube-synchronizer/kojahdkdppbdkgpdepmekohphlcobjhj)** — *Trusted by almost 1,000 users!*

## ✨ Features

- **Real-time Synchronization:** Play, pause, and seek videos perfectly synced across all connected devices.
- **Easy Room System:** One person creates a session (Host) and shares a simple 6-digit code with others (Receivers).
- **Fast & Lightweight:** Built with SolidJS and Vite for blazing-fast performance.
- **Modern UI:** Clean and intuitive interface powered by Tailwind CSS and DaisyUI.

## 🚀 How It Works

1. **Host a Session (Host):** 
   - Open a YouTube video you want to watch.
   - Click the extension icon and select "Start Sharing".
   - You will receive a unique 6-digit room code.
   
2. **Join a Session (Receiver):**
   - Click the extension icon and select "Join".
   - Enter the 6-digit code provided by the host.
   - The extension will automatically open the correct video and keep it synchronized with the host!

## 🛠️ Tech Stack

- **Framework:** [SolidJS](https://www.solidjs.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Extension Bundler:** [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Language:** TypeScript

## 💻 Development Setup

If you want to build the extension locally:

### Prerequisites

- Node.js (v18+ recommended)
- npm (lub yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/artiu/youtube-synchronizer.git
   cd youtube-synchronizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (with Hot Module Replacement):
   ```bash
   npm run dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** in the top right corner.
   - Click **"Load unpacked"** and select the `dist` folder generated in your project directory.

### Building for Production

To create a production-ready build:

```bash
npm run build
```
This will compile and minify the code into the `dist` folder, which can then be packed for the Chrome Web Store.

## 📝 License

This project is open-source and available under the MIT License.
