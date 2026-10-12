// ─────────────────────────────────────────────────────────────
//  Edit this file to personalise the portfolio.
//  Everything on the page is rendered from the data below.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Abhigyan',
  initials: 'A',
  title: 'Software Development Engineer',
  roles: [
    'Software Development Engineer',
    'Backend Engineer',
    'Full-Stack Developer',
    'Problem Solver',
  ],
  tagline:
    'I build scalable, reliable software — from clean APIs and distributed services to fast, polished user interfaces.',
  location: 'India',
  email: 'you@example.com', // TODO: replace with your email
  resume: '#', // TODO: link to your resume PDF (e.g. put resume.pdf in /public and use '/resume.pdf')
  socials: [
    { label: 'GitHub', url: 'https://github.com/abhigyan1627' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' }, // TODO
    { label: 'LeetCode', url: 'https://leetcode.com/' }, // TODO
  ],
};

export const about = {
  paragraphs: [
    "I'm a software engineer who enjoys turning ambiguous problems into well-designed systems. I care about readable code, thoughtful architecture, and shipping things that actually work in production.",
    'My toolkit spans data structures & algorithms, backend services, databases and modern frontend frameworks. I like owning features end-to-end — design, implementation, testing and deployment.',
  ],
  stats: [
    { value: 500, suffix: '+', label: 'DSA problems solved' },
    { value: 15, suffix: '+', label: 'Projects built' },
    { value: 10, suffix: '+', label: 'Technologies used' },
    { value: 99, suffix: '%', label: 'Coffee-driven uptime' },
  ],
};

export const skills = [
  {
    group: 'Languages',
    items: [
      { name: 'Java', level: 90 },
      { name: 'C++', level: 85 },
      { name: 'Python', level: 85 },
      { name: 'JavaScript / TypeScript', level: 85 },
      { name: 'SQL', level: 80 },
    ],
  },
  {
    group: 'Backend & Data',
    items: [
      { name: 'Spring Boot', level: 80 },
      { name: 'Node.js / Express', level: 85 },
      { name: 'REST & GraphQL APIs', level: 85 },
      { name: 'PostgreSQL / MySQL', level: 80 },
      { name: 'MongoDB / Redis', level: 75 },
    ],
  },
  {
    group: 'Frontend & Cloud',
    items: [
      { name: 'React', level: 85 },
      { name: 'HTML / CSS', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Git & CI/CD', level: 85 },
    ],
  },
];

export const techMarquee = [
  'Java', 'C++', 'Python', 'TypeScript', 'React', 'Node.js', 'Spring Boot',
  'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Git',
  'Linux', 'Kafka', 'GraphQL', 'Jest', 'System Design', 'DSA',
];

export const experience = [
  {
    role: 'Software Development Engineer',
    company: 'Company Name', // TODO
    period: '2024 — Present',
    points: [
      'Designed and shipped backend services handling high request volume with low latency.',
      'Improved API response times by optimising database queries and adding caching.',
      'Collaborated across teams on code reviews, design docs and on-call rotations.',
    ],
  },
  {
    role: 'Software Engineering Intern',
    company: 'Company Name', // TODO
    period: '2023',
    points: [
      'Built internal tools that automated manual workflows for the team.',
      'Wrote unit and integration tests, raising coverage on critical modules.',
    ],
  },
  {
    role: 'B.Tech, Computer Science',
    company: 'University Name', // TODO
    period: '2020 — 2024',
    points: [
      'Coursework: Data Structures, Algorithms, OS, DBMS, Computer Networks, OOP.',
      'Active competitive programmer and hackathon participant.',
    ],
  },
];

export const projects = [
  {
    title: 'Distributed URL Shortener',
    description:
      'A horizontally scalable URL shortening service with base62 IDs, Redis caching, rate limiting and click analytics.',
    tech: ['Java', 'Spring Boot', 'Redis', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/abhigyan1627',
    live: '',
  },
  {
    title: 'Real-time Chat Platform',
    description:
      'WebSocket-based messaging with rooms, presence, typing indicators and message persistence; deployed with CI/CD.',
    tech: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
    github: 'https://github.com/abhigyan1627',
    live: '',
  },
  {
    title: 'Task Scheduler & Job Queue',
    description:
      'A fault-tolerant job queue with retries, exponential backoff, priorities and a dashboard for monitoring workers.',
    tech: ['Python', 'FastAPI', 'Redis', 'React'],
    github: 'https://github.com/abhigyan1627',
    live: '',
  },
  {
    title: 'Algorithm Visualizer',
    description:
      'Interactive visualisations of sorting, graph and path-finding algorithms with step-by-step playback controls.',
    tech: ['TypeScript', 'React', 'Canvas'],
    github: 'https://github.com/abhigyan1627',
    live: '',
  },
];
