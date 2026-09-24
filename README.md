# 🌐 Subdomain Hub — aayushbabu.live

A maximalist, high-performance landing page directory and service launchpad for **[aayushbabu.live](https://aayushbabu.live)** and its subdomains.

![Subdomain Hub Preview](https://img.shields.io/badge/Status-Live-emerald?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Featured Subdomains

| Subdomain | Description | GitHub Repository | Status |
| :--- | :--- | :--- | :--- |
| **`exploitdb.aayushbabu.live`** | Search portal & vulnerability inspector for CVEs & exploits. | [ExploitDB-Website](https://github.com/aayushrambo8/ExploitDB-Website) | 🟢 Online |
| **`portfolio.aayushbabu.live`** | Digital media portfolio showcasing artwork & video productions. | [Media-Portfolio](https://github.com/aayushrambo8/Media-Portfolio) | 🟢 Online |
| **`tictactoe.aayushbabu.live`** | Interactive Tic-Tac-Toe web game with single/multiplayer AI. | [TicTacToe](https://github.com/aayushrambo8/TicTacToe) | 🟢 Online |

---

## ✨ Features

- **Dynamic Base Domain Switcher**: Click domain pill to change base domain name.
- **Embedded GitHub Badges & Direct Links**: Clickable GitHub repository badges for each project.
- **Search & Filters**: Real-time filtering by category, name, tech stack tags, or description.
- **Command Palette (`Ctrl + K` / `/`)**: Fast keyboard-driven command overlay.
- **Subdomain Manager**: Add, edit, or remove subdomains dynamically with `localStorage` persistence.
- **JSON Export / Import**: Backup or restore domain mapping configs.
- **Maximalist Design**: Dark/light themes, ambient neon glow effects, and responsive grid layouts.

---

## 🛠️ Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aayushrambo8/subdomain-hub.git
   cd subdomain-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## ☁️ Deploying to Vercel & Setting up `www.aayushbabu.live`

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of Subdomain Hub"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your GitHub repository.
   - Framework Preset: **Vite**.
   - Click **Deploy**.

3. **Link Custom Domain (`www.aayushbabu.live`)**:
   - In Vercel Project Settings ➔ **Domains**.
   - Add `www.aayushbabu.live` and `aayushbabu.live`.
   - Add the following DNS record in your Domain Registrar (Cloudflare / Namecheap / GoDaddy):
     - **CNAME**: `www` ➔ `cname.vercel-dns.com`
     - **A Record**: `@` ➔ `76.76.21.21`

---

## 📄 License

Licensed under the MIT License.
