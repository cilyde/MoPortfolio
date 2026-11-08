# 🪐 Mohamed's Portfolio — Spatial 3D Developer Portfolio

A modern, high-performance developer portfolio engineered with **React 19**, **Three.js**, **GSAP**, **Tailwind CSS v4**, and **Vite**. Features custom WebGL shaders, spatial depth, smooth inertial scrolling via Lenis, dynamic audio cues, and an editorial design system.

---

## ✨ Features

- **Interactive 3D WebGL Canvas**: Custom particle fields, spatial lighting, and dynamic visual states powered by Three.js and GLSL shaders.
- **Cinematic Animations**: Micro-interactions, scroll-driven timelines, and split-text reveals built with GSAP and Lenis.
- **Config-Driven Architecture**: Easily update content, work projects, bio, skills, experience, and socials by editing a single file (`src/config.ts`).
- **Tailwind CSS v4 + Custom Typography**: Styled using Instrument Serif, Syne, Geist, and Manrope font variable pairings.
- **Audio & Telemetry HUD**: Interactive sound effects and live session telemetry display.
- **Responsive & Accessible**: Designed to adapt fluidly across ultra-wide monitors, laptops, tablets, and mobile devices with reduced-motion support.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **3D & Graphics**: [Three.js](https://threejs.org/)
- **Animation**: [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: `@fontsource-variable/geist`, `@fontsource/instrument-serif`, `@fontsource/syne`, `@fontsource/manrope`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18.0.0 or higher recommended).

### 1. Clone the repository

```bash
git clone https://github.com/cilyde/MoPortfolio.git
cd MoPortfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

---

## ⚙️ Customization Guide

All site content is decoupled from layout components and centralized in `src/config.ts`:

1. **Personal Information**: Open `src/config.ts` and update the `personal` block (name, role, location, email, bio).
2. **Projects & Case Studies**: Modify the `projects` array with your own work, links, metrics, and screenshots in `src/assets/`.
3. **Skills & Tech Stack**: Update the `skills` array under `src/config.ts` to showcase your technical competencies.
4. **Experience & Career History**: Add your past roles, companies, and achievements in the `experience` section.
5. **Social Links**: Configure your GitHub, LinkedIn, X (Twitter), and contact URLs.

---

## 📂 Project Structure

```text
├── index.html              # HTML entrypoint & initial boot loader
├── src/
│   ├── assets/             # Project screenshots, images, audio files
│   ├── components/         # UI components (Hero, Work, Navigation, HUD, etc.)
│   ├── config.ts           # Central content and site configuration
│   ├── lib/                # Utility helpers & audio engine
│   ├── webgl/              # Three.js scene, camera, materials & shaders
│   ├── App.tsx             # Root application orchestrator
│   ├── main.tsx            # React DOM mounting
│   └── index.css           # Global CSS and Tailwind directives
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License & Terms of Use

This repository is open-sourced under the **MIT License with Attribution Required**.

### 🤝 You are free to:
- **Use and customize** this project for your own personal portfolio.
- **Fork, modify, and build upon** the codebase.
- **Learn from** the 3D WebGL implementation, animations, and architecture.

### ⚠️ Conditions (Credits Required):
1. **Give visible credit**: Please retain a clear link back to the original author in your site footer or README:
   > *Design & base template by [Mohamed Shabeen Ahamed](https://github.com/cilyde/MoPortfolio)*
2. **Make it yours**: Please replace all personal assets (images, project screenshots, bio, case studies, resume details, and email) with your own content before deploying. Do not impersonate or claim the original author's identity or work as your own.
3. **Star the repo**: If you find this project inspiring or helpful, a ⭐ on [GitHub](https://github.com/cilyde/MoPortfolio) is greatly appreciated!

---

## 👤 Author

**Mohamed Shabeen Ahamed**
- Website: [https://github.com/cilyde/MoPortfolio](https://github.com/cilyde/MoPortfolio)
- GitHub: [@mohamedwayne](https://github.com/mohamedwayne) / [@cilyde](https://github.com/cilyde)
- LinkedIn: [in/mohamedwayne](https://linkedin.com/in/mohamedwayne)
- Email: [mohamed.shabeen.ahamed@gmail.com](mailto:mohamed.shabeen.ahamed@gmail.com)

---

*Crafted with code, light & spatial depth.*
