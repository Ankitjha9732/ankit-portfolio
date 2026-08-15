// Skills data — preserved from the original portfolio (categories + proficiency).

export const skillCategories = [
  {
    category: 'Frontend',
    subtitle: 'Building modern user interfaces',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'SCSS'],
    progress: [
      { label: 'React', level: 70 },
      { label: 'JavaScript', level: 80 },
      { label: 'SCSS', level: 70 },
    ],
  },
  {
    category: 'Backend',
    subtitle: 'Building scalable APIs',
    skills: ['Node.js', 'Express', 'MongoDB'],
    progress: [
      { label: 'Node.js', level: 25 },
      { label: 'Express', level: 20 },
      { label: 'MongoDB', level: 15 },
    ],
  },
  {
    category: 'Tools',
    subtitle: 'Streamlining development workflows',
    skills: ['Git', 'VS Code', 'Vite'],
    progress: [
      { label: 'Git', level: 85 },
      { label: 'VS Code', level: 90 },
      { label: 'Vite', level: 30 },
    ],
  },
  {
    category: 'Learning',
    subtitle: 'Expanding my skill set',
    skills: ['Three.js', 'GSAP', 'Python'],
    progress: [
      { label: 'Three.js', level: 40 },
      { label: 'GSAP', level: 40 },
      { label: 'Python', level: 80 },
    ],
  },
]

// Flat technology list used by the 3D skills ecosystem scene.
export const ecosystemTech = [
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'Express',
  'Git',
  'Vite',
  'Three.js',
  'GSAP',
]

// Core labels used for the ecosystem hub.
export const coreTech = ['JavaScript', 'React', 'Node.js']

/**
 * Graph of every real technology from the source categories, each carrying
 * its category, proficiency level (when declared) and whether it is a
 * "currently learning" skill. Keeps the learning distinction explicit.
 */
export const techNodes = skillCategories.flatMap((group) =>
  group.skills.map((tech) => {
    const progress = group.progress.find((p) => p.label === tech)
    return {
      tech,
      category: group.category,
      level: progress ? progress.level : null,
      learning: group.category === 'Learning',
    }
  })
)