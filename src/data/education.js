// Education data — preserved from the original portfolio.

export const education = [
  {
    id: 'diploma',
    level: 'Diploma',
    degree: 'Computer Science & Engineering',
    institution: 'Government Polytechnic Muzaffarpur',
    years: '2021 – 2024',
    status: 'Completed',
    statusBadge: 'completed',
    subjects: [
      'Programming Fundamentals',
      'Database Systems',
      'Computer Networks',
      'Software Engineering',
      'Data Structures',
    ],
    stats: [
      { label: 'Duration', value: '3 Years' },
      { label: 'Completed', value: '2024' },
      { label: 'Degree', value: 'Diploma' },
    ],
  },
  {
    id: 'btech',
    level: "Bachelor's Degree",
    degree: 'Computer Science',
    specialization: 'Specialization: AI & Machine Learning',
    institution: 'CDLU Sirsa',
    years: '2024 – 2027',
    status: 'Currently Pursuing',
    statusBadge: 'current',
    subjects: [
      'Operating System',
      'Computer Network',
      'Deep Learning',
      'Artificial Intelligence',
      'Machine Learning',
      'Web Development',
    ],
    stats: [
      { label: 'Duration', value: '3 Years' },
      { label: 'Graduation', value: '2027' },
      { label: 'Degree', value: "Bachelor's" },
    ],
  },
]

/**
 * Developer journey milestones, built strictly from the education data above.
 * The 2027 node is the end of the declared B.Tech period (2024–2027), not an
 * invented achievement.
 */
export const journeyMilestones = [
  {
    year: '2021',
    phase: 'Started',
    title: 'Diploma — Computer Science & Engineering',
    org: 'Government Polytechnic Muzaffarpur',
    tag: 'completed',
    subjects: education.find((e) => e.id === 'diploma').subjects,
  },
  {
    year: '2024',
    phase: 'Graduated · and began the degree',
    title: 'B.Tech — Computer Science (AI & ML)',
    org: 'CDLU Sirsa',
    tag: 'current',
    subjects: education.find((e) => e.id === 'btech').subjects,
  },
  {
    year: '2027',
    phase: 'Projected graduation',
    title: 'B.Tech — Computer Science (AI & ML)',
    org: 'CDLU Sirsa',
    tag: 'next',
    subjects: null,
  },
]