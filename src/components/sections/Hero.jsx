import { motion } from 'framer-motion'
import ExperienceTable from '../shared/ExperienceTable'

export default function Hero() {
  const luxuryEasing = [0.16, 1, 0.3, 1]
  const baseDelay = 0.3

  const labels = [
    'FRONTEND DEVELOPER',
    'FULL STACK DEVELOPER',
    'B.TECH CSE (AI & ML)',
  ]

  const particles = [
    { size: 'w-72 h-72', color: 'bg-[#D97706]/5', blur: 'blur-[80px]', top: 'top-[10%]', left: 'left-[5%]' },
    { size: 'w-96 h-96', color: 'bg-[#D97706]/4', blur: 'blur-[100px]', bottom: 'bottom-[5%]', right: 'right-[10%]' },
    { size: 'w-64 h-64', color: 'bg-[#D97706]/3', blur: 'blur-[60px]', top: 'top-[30%]', right: 'right-[25%]' },
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#F7F3E9]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(217,119,6,0.08),_transparent_50%)]" />
        <div className="absolute top-[25%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(217,119,6,0.12),_transparent_60%)] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{
              opacity: { duration: 1, delay: 0.8 + i * 0.15 },
              y: { duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`absolute rounded-full ${p.size} ${p.color} ${p.blur} ${p.top || ''} ${p.left || ''} ${p.bottom || ''} ${p.right || ''}`}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            {/* Top Labels */}
            <div className="mb-6 sm:mb-8 space-y-1">
              {labels.map((label, i) => (
                <motion.p
                  key={label}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: baseDelay + i * 0.12, duration: 0.7, ease: luxuryEasing }}
                  className="font-mono text-[10px] sm:text-[11px] md:text-xs tracking-[0.3em] text-[#4B5563]"
                >
                  {label}
                </motion.p>
              ))}
            </div>

            {/* Heading */}
            <h1 className="mb-6 sm:mb-8">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: baseDelay + 0.4, duration: 0.8, ease: luxuryEasing }}
                className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-[#4B5563] tracking-wide mb-1 sm:mb-2"
                style={{ fontFamily: "'VT323', monospace", fontWeight: 400 }}
              >
                Hi, I'm
              </motion.span>

              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: baseDelay + 0.55, duration: 0.9, ease: luxuryEasing }}
                className="inline-flex flex-col items-start w-full sm:w-auto"
              >
                <span
                  className="font-black text-[#D97706] leading-[0.85] uppercase"
                  style={{ fontFamily: "'Bungee', sans-serif", fontSize: 'clamp(3rem, 12vw, 12rem)', letterSpacing: '-0.04em' }}
                >
                  ANKIT
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 0.7, duration: 0.85, ease: luxuryEasing }}
                  className="italic text-[#0F172A] leading-[0.9] md:ml-[60%] md:-mt-1"
                  style={{ fontFamily: "'Allan', cursive", fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}
                >
                  Jha
                </motion.span>
              </motion.div>
            </h1>



            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: baseDelay + 1.0, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col min-[600px]:flex-row gap-3 min-[600px]:gap-4 md:gap-6 items-center min-[600px]:justify-center lg:justify-start"
            >
              <motion.a
                href="/cv.pdf"
                download="Ankit_Jha_Resume.pdf"
                aria-label="Download Resume"
                whileHover={{ y: -3, boxShadow: '9px 9px 0 0 #000' }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-[85%] max-w-[280px] max-[380px]:max-w-[240px] h-[48px] max-[380px]:h-[44px] px-5 max-[380px]:px-4 py-2.5 bg-[#D97706] text-black font-semibold sm:font-black uppercase tracking-[-0.02em] text-[15px] max-[380px]:text-[14px] sm:text-sm border-[3px] sm:border-4 border-black shadow-[6px_6px_0_0_#000] max-[380px]:shadow-[4px_4px_0_0_#000] transition-all duration-200 rounded-none cursor-pointer sm:w-auto sm:max-w-none min-[600px]:max-w-none min-[600px]:w-auto min-[600px]:flex-1 lg:flex-none sm:h-auto sm:px-10 sm:py-4"
                >
                  DOWNLOAD RESUME
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/ankitjhaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect on LinkedIn"
                  whileHover={{ y: -3, boxShadow: '9px 9px 0 0 #000' }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-[85%] max-w-[280px] max-[380px]:max-w-[240px] h-[48px] max-[380px]:h-[44px] px-5 max-[380px]:px-4 py-2.5 bg-white text-black font-semibold sm:font-black uppercase tracking-[-0.02em] text-[15px] max-[380px]:text-[14px] sm:text-sm border-[3px] sm:border-4 border-black shadow-[6px_6px_0_0_#000] max-[380px]:shadow-[4px_4px_0_0_#000] transition-all duration-200 rounded-none cursor-pointer sm:w-auto sm:max-w-none min-[600px]:max-w-none min-[600px]:w-auto min-[600px]:flex-1 lg:flex-none sm:h-auto sm:px-10 sm:py-4"
              >
                CONNECT ON LINKEDIN
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: baseDelay, duration: 0.85, ease: luxuryEasing }}
            className="flex justify-center lg:justify-end lg:mr-8"
          >
            <ExperienceTable />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
