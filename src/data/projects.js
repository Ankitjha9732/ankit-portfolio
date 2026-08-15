// Real project data — preserved from the original portfolio.
// Paths use %20 encoding for spaces in the public folder filenames.

export const projects = [
  {
    id: 1,
    name: 'RestroOrder',
    category: 'Full Stack Web App',
    description:
      "A full-stack MERN application enabling QR-based restaurant ordering with real-time order tracking, secure admin authentication, responsive UI, and seamless customer-to-kitchen workflow.",
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'JWT', 'Tailwind CSS'],
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
    upcoming: false,
    image: '/PROJECTS%20IMG/project%201%20img.png',
  },
  {
    id: 2,
    name: 'ReelScape',
    category: 'Social Media App',
    description:
      'A responsive Instagram Reels-inspired web application built with HTML, CSS, and JavaScript, featuring smooth vertical video scrolling, interactive like, comment, share, and follow actions with a modern mobile-first user interface.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    features: [
      'Vertical Video Scrolling',
      'Interactive Like & Comment',
      'Share & Follow Actions',
      'Mobile-first UI',
      'Smooth Animations',
      'Responsive Design',
    ],
    github: 'https://github.com/Ankitjha9732',
    live: 'https://reel-proj.vercel.app/',
    upcoming: false,
    image: '/PROJECTS%20IMG/project%202%20img.png',
  },
  {
    id: 3,
    name: 'TechHive',
    category: 'Social Platform',
    description: '',
    tech: [],
    features: [],
    github: '#',
    live: '#',
    upcoming: true,
    image: null,
  },
  {
    id: 4,
    name: 'Recommendo',
    category: 'AI Engine',
    description: '',
    tech: [],
    features: [],
    github: '#',
    live: '#',
    upcoming: true,
    image: null,
  },
  {
    id: 5,
    name: 'CollabWrite',
    category: 'Collaborative Editor',
    description: '',
    tech: [],
    features: [],
    github: '#',
    live: '#',
    upcoming: true,
    image: null,
  },
]

export const showcaseProjects = projects.filter((p) => !p.upcoming)
export const upcomingProjects = projects.filter((p) => p.upcoming)
