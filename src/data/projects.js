// Real project data — preserved from the original portfolio.
// Content, descriptions and stacks reflect the actual repositories.

export const projects = [
  {
    id: 1,
    name: 'Syllabus Tracker',
    category: 'Learning Platform',
    status: 'live',
    featured: true,
    short:
      'Universal learning progress tracking — a full syllabus becomes an actionable plan, marked subtopic by subtopic with live progress, streaks and charts.',
    description:
      'A production-ready MERN learning platform that turns a full syllabus into an actionable, trackable plan — modules → topics → subtopics → status, all wired to live progress bars, streaks and charts. Pick a learning path (MERN, DSA or PCM) when you register, mark subtopics as Not Started, In Progress or Completed, and watch overall, per-module and per-topic progress recompute on the backend.',
    tech: [
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'React Router',
      'Axios',
      'Tailwind CSS',
      'Framer Motion',
      'JWT',
    ],
    features: [
      'Learning paths — MERN, DSA and PCM',
      'Subtopic status tracking',
      'Backend-computed progress',
      'Custom modules, topics & subtopics',
      'Private notes & resources',
      'Streaks & activity heatmap',
      'Search & status filters',
      'Dashboard with charts',
      'Secure JWT auth with bcrypt',
    ],
    github: 'https://github.com/Ankitjha9732/SYLLABUS-TRACKER',
    live: 'https://syllabus-tracker-beta.vercel.app/',
  },
  {
    id: 2,
    name: 'RestroOrder',
    category: 'Full Stack Web App',
    status: 'live',
    description:
      "A full-stack MERN application enabling QR-based restaurant ordering with real-time order tracking, secure admin authentication, responsive UI, and a seamless customer-to-kitchen workflow.",
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'JWT', 'Tailwind CSS'],
    features: [
      'QR-based Restaurant Ordering',
      'Secure Authentication',
      'Real-time Order Updates',
      'Admin Dashboard',
      'Responsive Design',
      'REST API',
    ],
    github: 'https://github.com/Ankitjha9732',
    live: 'https://restro-order-new.vercel.app/',
  },
  {
    id: 3,
    name: 'RepoReady',
    category: 'AI Project Assistant',
    status: 'dev',
    short:
      'An AI-powered platform that analyzes GitHub projects, identifies knowledge gaps, generates project-specific interview questions, and helps developers confidently explain and defend code they built with AI.',
    description:
      'RepoReady is being built to solve a growing problem among students and developers who use AI to accelerate project development but may not fully understand the code they end up building. The platform connects directly to a user’s GitHub project and analyzes the actual codebase instead of relying only on user-provided descriptions.',
    longDescription:
      'RepoReady is being built to solve a growing problem among students and developers who use AI to accelerate project development but may not fully understand the code they end up building. The platform connects directly to a user’s GitHub project and analyzes the actual codebase instead of relying only on user-provided descriptions. It examines the project’s architecture, technologies, APIs, database, and important files to identify areas the developer may not fully understand. Based on that analysis, RepoReady generates personalized interview questions, potential interviewer attack points, knowledge gaps, and a structured preparation plan. The platform will also include an AI Project Defense / Mock Interview experience where users answer questions based on their own project and receive feedback, weak-area analysis, understanding scores, and an overall Project & Interview Readiness Score.',
    tech: [],
    features: [
      'GitHub project analysis',
      'Codebase architecture review',
      'Knowledge gap identification',
      'Project-specific interview questions',
      'Interviewer attack-point modeling',
      'Personalized preparation plan',
      'AI Project Defense / Mock Interview',
      'Project & Interview Readiness Score',
    ],
    github: null,
    live: null,
  },
]

export const showcaseProjects = projects.filter((p) => p.status === 'live')
export const upcomingProjects = projects.filter((p) => p.status === 'dev')