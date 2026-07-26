import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import {
  SiReact, SiJavascript, SiTailwindcss, SiNodedotjs,
  SiExpress, SiMongodb, SiGit, SiPython,
  SiVite, SiThreedotjs, SiGreensock,
  SiSocketdotio, SiJsonwebtokens, SiHtml5, SiCss, SiSass,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { BiCodeAlt } from 'react-icons/bi'
import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa'
import { GraduationCap, School, Calendar, BookOpen, Check, Clock, Sparkles, Briefcase, MapPin, Mail } from 'lucide-react'
import { FiExternalLink, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import Hero from '../components/sections/Hero'
import SectionTitle from '../components/shared/SectionTitle'

const techColors = {
  React: '#61DAFB',
  JavaScript: '#F7DF1E',
  'Tailwind CSS': '#06B6D4',
  'Node.js': '#339933',
  Express: '#000000',
  MongoDB: '#47A248',
  'Socket.IO': '#010101',
  JWT: '#000000',
  HTML5: '#E34F26',
  CSS3: '#1572B6',
}

const techIconMap = {
  React: SiReact,
  JavaScript: SiJavascript,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  'Socket.IO': SiSocketdotio,
  JWT: SiJsonwebtokens,
  HTML5: SiHtml5,
  CSS3: SiCss,
}

const skillIcons = {
  React: SiReact,
  JavaScript: SiJavascript,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  Git: SiGit,
  'VS Code': VscVscode,
  Vite: SiVite,
  'Three.js': SiThreedotjs,
  GSAP: SiGreensock,
  Python: SiPython,
  HTML5: SiHtml5,
  CSS3: SiCss,
  SCSS: SiSass,
}

const categoryProgressBars = {
  Frontend: [
    { label: 'React', level: 70 },
    { label: 'JavaScript', level: 80 },
    { label: 'SCSS', level: 70 },
  ],
  Backend: [
    { label: 'Node.js', level: 25 },
    { label: 'Express', level: 20 },
    { label: 'MongoDB', level: 15 },
  ],
  Tools: [
    { label: 'Git', level: 85 },
    { label: 'VS Code', level: 90 },
    { label: 'Vite', level: 30 },
  ],
  Learning: [
    { label: 'Three.js', level: 40 },
    { label: 'GSAP', level: 40 },
    { label: 'Python', level: 80 },
  ],
}

const projectsData = [
  {
    img: '/PROJECTS%20IMG/project%201%20img.png',
    name: 'RestroOrder',
    category: 'Full Stack Web App',
    description: 'A full-stack MERN application enabling QR-based restaurant ordering with real-time order tracking, secure admin authentication, responsive UI, and seamless customer-to-kitchen workflow.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'JWT', 'Tailwind CSS'],
    features: ['QR-based Restaurant Ordering', 'Secure Authentication', 'Real-time Order Updates', 'Admin Dashboard', 'Responsive Design', 'REST API'],
    github: 'https://github.com',
    live: '#',
  },
  {
    img: '/PROJECTS%20IMG/project%202%20img.png',
    name: 'ReelScape',
    category: 'Social Media App',
    description: 'A responsive Instagram Reels-inspired web application built with HTML, CSS, and JavaScript, featuring smooth vertical video scrolling, interactive like, comment, share, and follow actions with a modern mobile-first user interface.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    features: ['Vertical Video Scrolling', 'Interactive Like & Comment', 'Share & Follow Actions', 'Mobile-first UI', 'Smooth Animations', 'Responsive Design'],
    github: 'https://github.com',
    live: 'https://reel-proj.vercel.app/',
  },
  {
    img: 'https://picsum.photos/seed/mernapp/800/600',
    name: 'TechHive',
    category: 'Social Platform',
    description: '',
    tech: [],
    features: [],
    upcoming: true,
    github: '#',
    live: '#',
  },
  {
    img: 'https://picsum.photos/seed/aitool/800/600',
    name: 'Recommendo',
    category: 'AI Engine',
    description: '',
    tech: [],
    features: [],
    upcoming: true,
    github: '#',
    live: '#',
  },
  {
    img: 'https://picsum.photos/seed/collab/800/600',
    name: 'CollabWrite',
    category: 'Collaborative Editor',
    description: '',
    tech: [],
    features: [],
    upcoming: true,
    github: '#',
    live: '#',
  },
]

export default function Home() {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (selectedProject !== null) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean)
      if (cards.length === 0) return

      let st, tl

      function build() {
        if (st) st.kill()
        if (tl) tl.kill()

        const total = cards.length
        const mid = (total - 1) / 2
        const cardWidth = 240
        const vw = window.innerWidth

        const maxTotalWidth = Math.min(vw * 0.9, 1400)
        const spacing = (maxTotalWidth - cardWidth) / (total - 1)

        gsap.set(cards, {
          x: 0,
          xPercent: -50,
          y: 0,
          rotate: i => gsap.utils.interpolate([-8, 8], i / (total - 1)),
          scale: 1,
          zIndex: i => i,
          opacity: 1,
        })

        st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        })

        tl = gsap.timeline({ scrollTrigger: st })

        tl.to(cards, {
          x: i => (i - mid) * spacing,
          rotate: 0,
          scale: 1,
          ease: 'none',
          stagger: 0.03,
          duration: 0.88,
        })
      }

      build()
      window.addEventListener('resize', build)

      cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -12, scale: 1.03, zIndex: 30, boxShadow: '0 24px 64px rgba(0,0,0,0.25)', duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, zIndex: i, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        })
      })

      return () => window.removeEventListener('resize', build)
    }, sectionRef)

    return () => ctx.revert()
  }, [selectedProject])
  return (
    <div>
      <Hero />

      {/* About Section */}
      <section id="about" className="section-padding bg-white/60" style={{ scrollMarginTop: 80 }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-12 max-w-6xl mx-auto items-center">
            {/* Left: NAME + FULL STACK — flush to portrait */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
               className="md:col-span-3 flex flex-col items-end text-right space-y-3 md:space-y-4 md:ml-8"
            >
              <div className="leading-none">
                <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#4B5563]">
                  ANKIT JHA
                </span>
              </div>
              <div
                className="leading-none font-black uppercase select-none whitespace-nowrap"
                style={{
                  fontFamily: "'SUSE Mono', monospace",
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  letterSpacing: '-0.1em',
                  transform: 'scaleX(0.75)',
                  transformOrigin: 'right center',
                }}
              >
                <span className="text-[#1F2937]">FULL STACK</span>
              </div>
            </motion.div>

            {/* Center: Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-6 flex justify-center"
            >
              <img
                src="/PROFF.PHOTO.png"
                alt="Portrait"
                className="w-full max-w-[min(400px,85vw)] aspect-[3/4] object-cover rounded-[20px]"
              />
            </motion.div>

            {/* Right: DEVELOPER + intro — flush to portrait */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-3 flex flex-col text-left space-y-4 md:space-y-6"
            >
              <div
                className="leading-none font-black uppercase select-none whitespace-nowrap"
                style={{
                  fontFamily: "'SUSE Mono', monospace",
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  letterSpacing: '-0.1em',
                  transform: 'scaleX(0.75)',
                  transformOrigin: 'left center',
                }}
              >
                <span className="text-[#1F2937]">DEVELOPER</span>
              </div>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-[min(280px,85vw)]">
                Full Stack Developer passionate about building fast, responsive, and scalable web applications with clean code and modern technologies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding relative overflow-hidden" style={{ scrollMarginTop: 80 }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,119,6,0.05),transparent_60%)]" />
          <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(217,119,6,0.04),transparent_60%)]" />
          <div className="absolute top-[50%] left-[60%] w-48 h-48 rounded-full bg-[#D97706]/[0.03] blur-[60px]" />
          <div className="absolute top-[15%] right-[30%] w-32 h-32 rounded-full bg-[#D97706]/[0.02] blur-[40px]" />
        </div>

        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 lg:px-8 relative">
          {/* Background Word */}
          <div className="pointer-events-none absolute left-0 top-0 text-[12vw] font-black text-[#1D1F22]/[0.03] select-none leading-none" style={{ fontFamily: "'Mitr', sans-serif" }}>
            TECH STACK
          </div>

          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 md:mb-12 relative z-10"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1F22]" style={{ fontFamily: "'Mitr', sans-serif" }}>
              SKILLS
            </h2>
            <div className="flex justify-start mt-2">
              <span className="text-xs text-[#D97706] font-mono font-semibold tracking-wider uppercase">
                Hover to view proficiency →
              </span>
            </div>
          </motion.div>

          {/* Main Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative rounded-[32px] border border-white/20 bg-white/50 backdrop-blur-[18px] p-6 md:p-8 lg:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_56px_rgba(217,119,6,0.06)] transition-shadow duration-500"
          >
            {/* Glass reflection */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-[32px] pointer-events-none" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }} />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                { category: 'Frontend', icon: SiReact, subtitle: 'Building modern user interfaces', skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'SCSS'] },
                { category: 'Backend', icon: SiNodedotjs, subtitle: 'Building scalable APIs', skills: ['Node.js', 'Express', 'MongoDB'] },
                { category: 'Tools', icon: VscVscode, subtitle: 'Streamlining development workflows', skills: ['Git', 'VS Code', 'Vite'] },
                { category: 'Learning', icon: SiPython, subtitle: 'Expanding my skill set', skills: ['Three.js', 'GSAP', 'Python'] },
              ].map((group, idx) => {
                const CategoryIcon = group.icon
                return (
                  <motion.div
                    key={group.category}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-2xl border border-white/10 p-5 md:p-6 transition-all duration-500 ease-[0.22,1,0.36,1] ${
                      hoveredIdx === idx
                        ? 'bg-white/50 backdrop-blur-[14px] shadow-[0_8px_32px_rgba(217,119,6,0.12)] border-[#D97706]/25'
                        : 'bg-white/20 backdrop-blur-[8px] hover:bg-white/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {/* Category Icon */}
                    <motion.div
                      animate={hoveredIdx === idx ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 shadow-sm"
                    >
                      <CategoryIcon className="w-5 h-5 text-[#D97706]" />
                    </motion.div>

                    {/* Title & Subtitle */}
                    <h3 className="text-base font-semibold text-[#1D1F22]">{group.category}</h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 mb-4 leading-relaxed">{group.subtitle}</p>

                    {/* Skill Chips */}
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill, i) => {
                        const SkillIcon = skillIcons[skill]
                        return (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 + i * 0.06, duration: 0.3 }}
                            whileHover={{ y: -2, scale: 1.05 }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/40 backdrop-blur-sm border border-white/20 text-[11px] text-[#4B5563] font-medium hover:border-[#D97706]/30 hover:bg-[#D97706]/5 hover:text-[#D97706] hover:shadow-[0_0_12px_rgba(217,119,6,0.15)] transition-all duration-200 cursor-default"
                          >
                            {SkillIcon && <SkillIcon className="w-3 h-3" />}
                            {skill}
                          </motion.span>
                        )
                      })}
                    </div>

                    {/* Proficiency Panel */}
                    <div
                      className={`overflow-hidden transition-all duration-700 ease-[0.22,1,0.36,1] ${
                        hoveredIdx === idx ? 'max-h-80 mt-5' : 'max-h-0 mt-0'
                      }`}
                    >
                      <div className={`transition-all duration-300 delay-75 ${hoveredIdx === idx ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="h-px bg-[#D97706]/15 mb-4" />
                        <div className="space-y-3">
                          {(categoryProgressBars[group.category] || []).map((bar, i) => {
                            const levelLabel = bar.level >= 85 ? 'Expert' : bar.level >= 70 ? 'Advanced' : bar.level >= 55 ? 'Intermediate' : 'Learning'
                            return (
                              <motion.div
                                key={bar.label}
                                initial={{ opacity: 0, y: 6 }}
                                animate={hoveredIdx === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                                transition={{ delay: hoveredIdx === idx ? i * 0.08 : 0, duration: 0.3 }}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      const BarIcon = skillIcons[bar.label]
                                      return BarIcon ? <BarIcon className="w-3 h-3 text-[#D97706]" /> : null
                                    })()}
                                    <span className="text-xs font-medium text-[#1D1F22]/70">{bar.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">{levelLabel}</span>
                                    <span className="text-xs font-mono text-[#D97706] font-semibold">{bar.level}%</span>
                                  </div>
                                </div>
                                <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#D97706]/70 shadow-[0_0_8px_rgba(217,119,6,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={hoveredIdx === idx ? { width: `${bar.level}%` } : { width: 0 }}
                                    transition={{
                                      duration: 0.9,
                                      delay: hoveredIdx === idx ? i * 0.1 : 0,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-padding relative overflow-hidden" style={{ scrollMarginTop: 80 }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(217,119,6,0.06),transparent_60%)]" />
          <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,119,6,0.04),transparent_60%)]" />
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1F22]" style={{ fontFamily: "'Mitr', sans-serif" }}>
              PROJECTS
            </h2>
            <p className="mt-3 text-[#4B5563] font-mono text-xs uppercase tracking-[0.25em] max-w-2xl">
              A collection of projects showcasing my skills in frontend development, full-stack applications, UI/UX, and modern web technologies.
            </p>
          </motion.div>

          {selectedProject === null ? (
            <div ref={sectionRef} className="relative w-full flex justify-center" style={{ height: 'clamp(380px, 60vw, 520px)' }}>
              {projectsData.map((project, idx) => (
                <div
                  key={idx}
                  ref={el => { cardsRef.current[idx] = el }}
                  data-index={idx}
                  onClick={() => setSelectedProject(idx)}
                  className="project-card absolute left-1/2 w-[clamp(150px,40vw,240px)] rounded-[30px] border border-white/15 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden cursor-pointer group"
                  style={{ willChange: 'transform' }}
                >
                  <div className="aspect-[2/3] overflow-hidden bg-[#1a1a2e] relative">
                    <img
                      src={project.img}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <div>
                        <p className="text-white font-semibold text-sm">{project.name}</p>
                        <p className="text-white/60 text-[10px] font-mono uppercase tracking-wider mt-0.5">{project.category}</p>
                        {!project.upcoming && project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.tech.map(t => {
                              const Icon = techIconMap[t]
                              return Icon ? (
                                <span key={t} className="transition-transform duration-200 hover:scale-110">
                                  <Icon className="w-3.5 h-3.5" style={{ color: techColors[t] || '#fff' }} />
                                </span>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProject}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="mb-8 inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#D97706] transition-colors font-mono uppercase tracking-wider"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  All Projects
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                  <div className="lg:col-span-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] group cursor-default"
                      whileHover={{ y: -4, boxShadow: '0 24px 64px rgba(217,119,6,0.1), 0 8px 32px rgba(0,0,0,0.15)' }}
                      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                    >
                      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#1D1F22]">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <div className="ml-4 flex-1 max-w-[240px] mx-auto">
                          <div className="bg-[#2D2F33] rounded text-[10px] text-white/40 px-3 py-1 text-center font-mono truncate">
                            localhost / {projectsData[selectedProject].name.toLowerCase()}
                          </div>
                        </div>
                      </div>
                      <div className="overflow-hidden bg-[#1a1a2e]">
                        <img
                          src={projectsData[selectedProject].img}
                          alt={projectsData[selectedProject].name}
                          className="w-full max-h-[520px] object-contain bg-[#1a1a2e] transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="lg:col-span-2">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-5"
                    >
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D97706] mb-1">
                          {projectsData[selectedProject].category}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1D1F22]">
                          {projectsData[selectedProject].name}
                        </h3>
                      </div>

                      {projectsData[selectedProject].upcoming ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-dashed border-[#CFD3D8] bg-[#F7F3E9]/50 text-center"
                        >
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-mono uppercase tracking-wider mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Upcoming
                          </span>
                          <p className="text-sm text-[#6B7280] max-w-xs">
                            This project is currently in development. Stay tuned for updates!
                          </p>
                        </motion.div>
                      ) : (
                        <>
                          <p className="text-sm text-[#4B5563] leading-relaxed">
                            {projectsData[selectedProject].description}
                          </p>

                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#6B7280] mb-3">Tech Stack</p>
                            <div className="flex flex-wrap gap-2">
                              {projectsData[selectedProject].tech.map((t, i) => (
                                <motion.span
                                  key={t}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-mono bg-[#F7F3E9] border border-[#CFD3D8] text-[#4B5563] hover:border-[#D97706]/40 hover:bg-[#D97706]/5 hover:text-[#D97706] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                                >
                                  {t}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#6B7280] mb-3">Key Features</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                              {projectsData[selectedProject].features.map((f, i) => (
                                <motion.div
                                  key={f}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                                  className="flex items-center gap-2 text-sm text-[#4B5563]"
                                >
                                  <Check className="w-3 h-3 text-[#D97706] shrink-0 stroke-[2]" />
                                  {f}
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <motion.a
                              href={projectsData[selectedProject].github}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1D1F22] bg-white text-[#1D1F22] font-semibold text-sm hover:bg-[#1D1F22] hover:text-white transition-colors duration-200"
                            >
                              <FaGithub className="w-4 h-4" />
                              GitHub
                            </motion.a>
                            <motion.a
                              href={projectsData[selectedProject].live}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#D97706] bg-[#D97706] text-white font-semibold text-sm hover:shadow-[0_8px_24px_rgba(217,119,6,0.3)] transition-shadow duration-200"
                            >
                              Live Demo
                              <FiArrowRight className="w-4 h-4" />
                            </motion.a>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#CFD3D8]/60">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B7280] mb-4">Other Projects</p>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {projectsData.map((project, idx) => (
                      idx !== selectedProject && (
                        <motion.button
                          key={idx}
                          onClick={() => setSelectedProject(idx)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + idx * 0.08, duration: 0.3 }}
                          className="flex-shrink-0 group cursor-pointer text-left"
                        >
                          <div className="w-36 rounded-xl overflow-hidden border border-[#CFD3D8] bg-white shadow-sm group-hover:border-[#D97706]/40 group-hover:shadow-[0_4px_16px_rgba(217,119,6,0.1)] transition-all duration-200">
                            <div className="aspect-[4/3] overflow-hidden bg-[#1a1a2e]">
                              <img
                                src={project.img}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-2.5">
                              <p className="text-xs font-semibold text-[#1D1F22] truncate">{project.name}</p>
                              <p className="text-[9px] text-[#6B7280] font-mono uppercase tracking-wider truncate">{project.category}</p>
                              {!project.upcoming && project.tech.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {project.tech.slice(0, 4).map(t => {
                                    const Icon = techIconMap[t]
                                    return Icon ? (
                                      <Icon key={t} className="w-2.5 h-2.5" style={{ color: techColors[t] || '#9CA3AF' }} />
                                    ) : null
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      )
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="section-padding relative overflow-hidden" style={{ scrollMarginTop: 80 }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(217,119,6,0.05),transparent_60%)]" />
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1F22]" style={{ fontFamily: "'Mitr', sans-serif" }}>
              EDUCATION
            </h2>
            <p className="mt-3 text-[#4B5563] font-mono text-xs uppercase tracking-[0.25em]">
              My Academic Journey
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[18px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-[#CFD3D8] overflow-hidden">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="w-full bg-[#D97706] origin-top"
              />
            </div>

            <div className="space-y-16 md:space-y-24">
              {/* Diploma — left on desktop, full-width on mobile */}
              <div className="relative pl-12 md:pl-0">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="md:w-[calc(50%-2rem)] rounded-2xl border border-[#CFD3D8] bg-white/80 p-6 md:p-8 shadow-soft group cursor-default"
                  whileHover={{ y: -10, boxShadow: '0 24px 64px rgba(217,119,6,0.1), 0 8px 24px rgba(0,0,0,0.06)' }}
                  transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                >
                  <div className="flex justify-end mb-3">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#E5E7EB] text-[#6B7280] border border-[#CFD3D8]"
                    >
                      <Clock className="w-3 h-3" />
                      Completed
                    </motion.span>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
                    >
                      <GraduationCap className="w-6 h-6 text-[#D97706] mt-1 shrink-0" />
                    </motion.div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#6B7280] mb-0.5">Diploma</p>
                      <h3 className="text-xl font-bold text-[#1D1F22] leading-tight">Computer Science & Engineering</h3>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5 pb-5 border-b border-[#CFD3D8]/60">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-[#4B5563]"
                    >
                      <School className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span>Government Polytechnic Muzaffarpur</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.55, duration: 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-[#4B5563]"
                    >
                      <Calendar className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span>2021 – 2024</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-[#4B5563]"
                    >
                      <Check className="w-4 h-4 text-[#D97706] shrink-0 stroke-[2]" />
                      <span>Completed</span>
                    </motion.div>
                  </div>

                  <div className="mb-5">
                    <motion.h4
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.55, duration: 0.3 }}
                      className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#6B7280] mb-3 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Core Subjects
                    </motion.h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {[
                        'Programming Fundamentals',
                        'Database Systems',
                        'Computer Networks',
                        'Software Engineering',
                        'Data Structures',
                      ].map((subject, i) => (
                        <motion.div
                          key={subject}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.65 + i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-2 text-sm text-[#4B5563]"
                        >
                          <Check className="w-3 h-3 text-[#D97706] shrink-0 stroke-[2]" />
                          {subject}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#CFD3D8]/60">
                    {[
                      { label: 'Duration', value: '3 Years' },
                      { label: 'Completed', value: '2024' },
                      { label: 'Degree', value: 'Diploma' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.85 + i * 0.1, duration: 0.3 }}
                      >
                        <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">{item.label}</p>
                        <p className="text-sm font-semibold text-[#1D1F22] mt-0.5">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
                  className="absolute left-[9px] md:left-1/2 md:-translate-x-1/2 top-0 w-[18px] h-[18px] rounded-full border-[3px] border-[#D97706] bg-[#F7F3E9] z-10 shadow-[0_0_0_4px_rgba(217,119,6,0.15)]"
                />
              </div>

              {/* B.Tech — right on desktop */}
              <div className="relative pl-12 md:pl-0">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="md:w-[calc(50%-2rem)] md:ml-auto rounded-2xl border border-[#CFD3D8] bg-white/80 p-6 md:p-8 shadow-soft group cursor-default"
                  whileHover={{ y: -10, boxShadow: '0 24px 64px rgba(217,119,6,0.1), 0 8px 24px rgba(0,0,0,0.06)' }}
                  transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                >
                  <div className="flex justify-end mb-3">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      Current
                    </motion.span>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
                    >
                      <GraduationCap className="w-6 h-6 text-[#D97706] mt-1 shrink-0" />
                    </motion.div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#6B7280] mb-0.5">Bachelor&apos;s Degree</p>
                      <h3 className="text-xl font-bold text-[#1D1F22] leading-tight">Computer Science</h3>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#D97706] mb-4 ml-9">Specialization: AI &amp; Machine Learning</p>

                  <div className="space-y-2 mb-5 pb-5 border-b border-[#CFD3D8]/60">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-[#4B5563]"
                    >
                      <School className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span>CDLU Sirsa</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.55, duration: 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-[#4B5563]"
                    >
                      <Calendar className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span>2024 – 2027</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-[#4B5563]"
                    >
                      <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span>Currently Pursuing</span>
                    </motion.div>
                  </div>

                  <div className="mb-5">
                    <motion.h4
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.55, duration: 0.3 }}
                      className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#6B7280] mb-3 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Core Subjects
                    </motion.h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {[
                        'Operating System',
                        'Computer Network',
                        'Deep Learning',
                        'Artificial Intelligence',
                        'Machine Learning',
                        'Web Development',
                      ].map((subject, i) => (
                        <motion.div
                          key={subject}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.65 + i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-2 text-sm text-[#4B5563]"
                        >
                          <Check className="w-3 h-3 text-[#D97706] shrink-0 stroke-[2]" />
                          {subject}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#CFD3D8]/60">
                    {[
                      { label: 'Duration', value: '3 Years' },
                      { label: 'Graduation', value: '2027' },
                      { label: 'Degree', value: "Bachelor's" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.85 + i * 0.1, duration: 0.3 }}
                      >
                        <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">{item.label}</p>
                        <p className="text-sm font-semibold text-[#1D1F22] mt-0.5">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
                  className="absolute left-[9px] md:left-1/2 md:-translate-x-1/2 top-0 w-[18px] h-[18px] rounded-full border-[3px] border-[#D97706] bg-[#F7F3E9] z-10 shadow-[0_0_0_4px_rgba(217,119,6,0.15)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding relative overflow-hidden" style={{ scrollMarginTop: 80 }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(217,119,6,0.06),transparent_60%)]" />
        </div>

        <div className="container-custom">
          {/* Background Word */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[5%] text-[15vw] font-black text-[#1D1F22]/[0.03] select-none leading-none" style={{ fontFamily: "'Mitr', sans-serif" }}>
            CONTACT
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1F22]" style={{ fontFamily: "'Mitr', sans-serif" }}>
              Let&apos;s Connect
            </h2>
            <p className="mt-3 text-[#4B5563] font-mono text-xs uppercase tracking-[0.25em]">
              I&apos;d love to hear from you.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
            {/* Left: Available for Opportunities */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div className="rounded-2xl border border-[#CFD3D8] bg-white/70 p-6 md:p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-3 w-3 relative">
                    <span className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-75" />
                    <span className="absolute inset-0 rounded-full bg-[#22C55E]" />
                  </span>
                  <span className="text-sm font-semibold text-[#1D1F22]">Available for Work</span>
                </div>

                <div className="space-y-3 mb-5 pb-5 border-b border-[#CFD3D8]/60">
                  {[
                    { icon: Briefcase, text: 'Frontend Development' },
                    { icon: Briefcase, text: 'Full Stack Projects' },
                    { icon: Briefcase, text: 'Open Source Collaboration' },
                    { icon: Briefcase, text: 'Freelance Opportunities' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                      className="flex items-center gap-3 text-sm text-[#4B5563]"
                    >
                      <item.icon className="w-4 h-4 text-[#D97706] shrink-0" />
                      {item.text}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="flex items-center gap-3 text-sm text-[#4B5563]"
                >
                  <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span><span className="font-semibold text-[#1D1F22]">Response Time:</span> Usually within 24 hours</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Contact Spec */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              whileHover={{ y: -6, boxShadow: '12px 12px 0 0 #000000' }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")`,
                boxShadow: '6px 6px 0 0 #000000',
              }}
              className="w-full rounded-none border-[3px] border-black bg-white text-black transition-all duration-300"
            >
              <div className="border-b-[3px] border-black bg-[#D97706] px-6 py-4 shadow-[0_0_15px_rgba(217,119,6,0.15)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(217,119,6,0.35)]">
                <h3 className="font-mono text-sm font-black uppercase tracking-[0.25em] text-black">
                  Contact Spec
                </h3>
              </div>
              <div className="divide-y-[2px] divide-black">
                {[
                  { label: 'EMAIL', value: 'ankitjhaworks@gmail.com', icon: Mail },
                  { label: 'LINKEDIN', value: 'linkedin.com/in/ankitjhaa', icon: FaLinkedin },
                  { label: 'GITHUB', value: 'github.com/ankitjha', icon: FaGithub },
                  { label: 'TWITTER / X', value: 'x.com/Ankitjh07', icon: FaTwitter },
                  { label: 'LOCATION', value: 'India', icon: MapPin },
                  { label: 'STATUS', value: 'Available for Opportunities' },
                  { label: 'RESPONSE', value: 'Within 24 Hours' },
                ].map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                    className="grid grid-cols-[35%_65%] items-center min-h-[50px]"
                  >
                    <div className="h-full border-r-[2px] border-black bg-[#fbfbfb]/80 px-3 sm:px-4 py-3 flex items-center gap-2 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-black overflow-hidden">
                      {row.icon && <row.icon className="w-3 h-3 text-[#D97706] shrink-0" />}
                      {row.label}
                    </div>
                    <div className="px-3 sm:px-4 py-3 font-sans text-[11px] sm:text-sm text-slate-800 font-semibold flex items-center">
                      {row.label === 'STATUS' ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="inline-block h-2.5 w-2.5 rounded-full bg-[#D97706] shadow-[0_0_8px_rgba(217,119,6,0.8)]"
                          />
                          <span className="text-black font-bold">{row.value}</span>
                        </span>
                      ) : (
                        row.value
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mx-auto mt-12 mb-10 max-w-[700px] text-center text-base text-[#4B5563] leading-relaxed"
          >
            Whether you have a question, project opportunity, or simply want to connect, I&apos;d love to hear from you. Let&apos;s create something meaningful together.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center"
          >
            <motion.a
              href="mailto:ankitjhaworks@gmail.com"
              whileHover={{ y: -3, boxShadow: '9px 9px 0 0 #000' }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-[85%] max-w-[280px] max-[380px]:max-w-[240px] h-[48px] max-[380px]:h-[44px] px-5 max-[380px]:px-4 py-2.5 bg-[#D97706] text-black font-semibold sm:font-black uppercase tracking-[-0.02em] text-[15px] max-[380px]:text-[14px] sm:text-sm border-[3px] sm:border-4 border-black shadow-[6px_6px_0_0_#000] max-[380px]:shadow-[4px_4px_0_0_#000] transition-all duration-200 rounded-none cursor-pointer sm:w-auto sm:max-w-none sm:h-auto sm:px-10 sm:py-4"
            >
              SEND AN EMAIL
              <motion.span
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="inline-block"
              >
                →
              </motion.span>
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/ankitjhaa/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, boxShadow: '9px 9px 0 0 #000' }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-[85%] max-w-[280px] max-[380px]:max-w-[240px] h-[48px] max-[380px]:h-[44px] px-5 max-[380px]:px-4 py-2.5 bg-white text-black font-semibold sm:font-black uppercase tracking-[-0.02em] text-[15px] max-[380px]:text-[14px] sm:text-sm border-[3px] sm:border-4 border-black shadow-[6px_6px_0_0_#000] max-[380px]:shadow-[4px_4px_0_0_#000] transition-all duration-200 rounded-none cursor-pointer sm:w-auto sm:max-w-none sm:h-auto sm:px-10 sm:py-4"
            >
              CONNECT ON LINKEDIN
              <motion.span
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="inline-block"
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-center gap-5 mt-10"
          >
            {[
              { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
              { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ankitjhaa/', label: 'LinkedIn' },
              { icon: FaTwitter, href: 'https://x.com/Ankitjh07', label: 'Twitter' },
              { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: FaEnvelope, href: 'mailto:ankitjhaworks@gmail.com', label: 'Email' },
            ].map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
                whileHover={{ y: -3, scale: 1.12, rotate: 3, color: '#D97706' }}
                whileTap={{ scale: 0.92 }}
                className="text-[#6B7280] transition-colors duration-200"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
