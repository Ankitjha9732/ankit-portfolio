# 🧑‍🚀 Ankit Jha — Portfolio

A design-first personal portfolio built with **React**, **Three.js**, and **GSAP**. It's my UI/UX showpiece — focused on motion, interaction detail, and a polished responsive experience across desktop and mobile.

**Live site** → [ankit-portfolio-puce.vercel.app](https://ankit-portfolio-puce.vercel.app/)

## ✨ Features

- **3D interactive scenes** built with React Three Fiber (One, Three.js) — hero, projects, and about sections
- **GSAP scroll animations** with Lenis smooth scrolling
- **Custom micro-interactions** — magnetic buttons, custom cursor, and a progress navigation
- **Complete section set** — Hero, About, Skills, Projects, Education, Journey, Contact
- **Contact section** with direct `mailto:` reach-out
- **Fully responsive** mobile-first layouts
- **Lazy scene loading** for better initial performance
- Error boundary and custom loading experience

## 🧰 Tech Stack

| Area | Tech |
|------|------|
| Core | React 19, Vite |
| Styling | Tailwind CSS, custom CSS |
| Motion | GSAP, Lenis (smooth scroll) |
| 3D / WebGL | Three.js, @react-three/fiber, @react-three/drei |
| Icons | react-icons |
| Forms | EmailJS |

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev            # http://localhost:5173
```

### Production build

```bash
npm run build && npm run preview
```

## 🌍 Deployment

Deployed on **Vercel**. Every push to `main` triggers an automatic production build.

## 📁 Project Structure

```text
src/
├── animations/         # GSAP scroll & entrance animations
├── components/
│   ├── layout/         # Layout, Loader, ProgressNav
│   ├── sections/       # Hero, About, Skills, Projects, Education, Journey, Contact
│   ├── shared/         # CustomCursor, Magnetic, TextLink, ErrorBoundary
│   └── three/          # React Three Fiber scenes (Identity, Restro, Syllabus…)
├── data/               # content: projects, skills, education, profile
├── hooks/              # useMagnetic, useResponsive, useScrollProgress, useSmoothScroll
├── lib/                # helpers (scroll, system start)
├── pages/              # Home
└── styles/             # globals, index
```

## 🗺️ Roadmap

- Add a dark/light theme toggle
- Improve accessibility pass and keyboard navigation
- Add case-study pages for featured projects

## 📬 Contact

Want to collaborate or hire me? Reach out via the [contact form](https://ankit-portfolio-puce.vercel.app/) or on [LinkedIn](https://www.linkedin.com/in/ankitjhaa/).