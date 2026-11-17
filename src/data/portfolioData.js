import { Database, Wrench } from "lucide-react";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
} from "react-icons/fa6";

import {
  SiExpress,
  SiMongodb,
  SiMysql,
  SiExpo,
  SiSupabase,
} from "react-icons/si";

export const personalInfo = {
  name: "Anus Afzal",
  role: "Software Engineering Student | Aspiring Full Stack Developer",
  status: "Available for Software Engineering Internships & Junior Roles",
  university: "UBIT, University of Karachi",
  department: "Department of Computer Science (UBIT)",
  degree: "Bachelor of Science in Software Engineering",
  location: "Karachi, Pakistan",
  email: "anasafzal189@gmail.com", // Placeholder: replace with your actual email
  emailPlaceholderNotice: "placeholder: replace with your actual email",
  github: "https://github.com/AnusAfzal",
  githubNotice: "replace with your specific username if different",
  linkedin: "https://www.linkedin.com/in/anus-afzal-551996351/", // Placeholder: replace with your profile link
  linkedinNotice: "placeholder: replace with your actual LinkedIn profile URL",
  resumeUrl: "/resume.pdf",
  shortBio:
    "Software Engineering student at UBIT, University of Karachi. Passionate about building functional full-stack web applications, backend services, and practical digital solutions.",
  aboutText: [
    "I am a Software Engineering student at UBIT (Department of Computer Science), University of Karachi, with a genuine curiosity for how computer systems and software architectures operate behind the screen.",
    "My technical focus spans full-stack web development, backend engineering, RESTful API design, and database modeling. I believe the most effective way to understand software engineering principles is by building real, practical applications.",
    "Currently, I am strengthening my full-stack capabilities, exploring cross-platform mobile development with React Native, and actively looking for internship and junior developer opportunities where I can contribute to meaningful engineering teams.",
  ],
};

export const skillsData = [
  // Frontend
  {
    name: "HTML5",
    category: "Frontend",
    icon: FaHtml5,
    status: "Core",
    description: "Semantic markup, accessibility, modern standards",
  },
  {
    name: "CSS3",
    category: "Frontend",
    icon: FaCss3Alt,
    status: "Core",
    description: "Flexbox, CSS Grid, animations, responsive design",
  },
  {
    name: "JavaScript",
    category: "Frontend",
    icon: FaJs,
    status: "Core",
    description: "ES6+, asynchronous programming, DOM manipulation",
  },
  {
    name: "React",
    category: "Frontend",
    icon: FaReact,
    status: "Core",
    description: "Functional components, hooks, state management, SPA",
  },

  // Backend
  {
    name: "Node.js",
    category: "Backend",
    icon: FaNodeJs,
    status: "Core",
    description: "Server-side runtime, asynchronous event-driven I/O",
  },
  {
    name: "Express.js",
    category: "Backend",
    icon: SiExpress,
    status: "Core",
    description: "RESTful API architecture, routing, middleware",
  },

  // Database
  {
    name: "MySQL",
    category: "Database",
    icon: SiMysql,
    status: "Core",
    description: "Relational database design, querying, schema normalization",
  },
  {
    name: "MongoDB",
    category: "Database",
    icon: SiMongodb,
    status: "Core",
    description: "NoSQL document store, collections, aggregation pipelines",
  },
  {
    name: "SQL",
    category: "Database",
    icon: Database,
    status: "Core",
    description: "Structured queries, joins, constraints, indexing basics",
  },

  // Tools
  {
    name: "Git",
    category: "Tools",
    icon: FaGitAlt,
    status: "Core",
    description: "Version control, branching workflows, commit hygiene",
  },
  {
    name: "GitHub",
    category: "Tools",
    icon: FaGithub,
    status: "Core",
    description: "Repository hosting, pull requests, collaboration",
  },
  {
    name: "VS Code",
    category: "Tools",
    icon: Wrench,
    status: "Core",
    description: "Development environment, debugging, extensions",
  },

  // Learning / Exploring
  {
    name: "React Native & Expo",
    category: "Learning",
    icon: SiExpo,
    status: "Learning",
    description: "Cross-platform mobile application development",
  },
  {
    name: "Supabase",
    category: "Learning",
    icon: SiSupabase,
    status: "Learning",
    description: "Backend-as-a-service, PostgreSQL, real-time auth",
  },
];

export const projectsData = [
  {
    id: "liftlog",
    number: "01",
    name: "LiftLog",
    category: "Mobile",
    categoryLabel: "Mobile Application",
    status: "In Development",
    statusType: "progress",
    shortDescription:
      "A dedicated fitness and workout tracking mobile application designed to log exercise routines, record training sets, and monitor fitness progression over time.",
    technologies: ["React Native", "Expo", "Supabase", "JavaScript"],
    githubUrl: "https://github.com/AnusAfzal/LiftLog", // Placeholder repo link
    githubPlaceholder: true,
    demoUrl: null,
    highlights: [
      "Custom routine and set logging",
      "Cloud data persistence via Supabase",
      "Designed for quick in-gym entry",
    ],
  },
  {
    id: "moment",
    number: "02",
    name: "Moment",
    category: "Mobile",
    categoryLabel: "Mobile & Backend",
    status: "In Development",
    statusType: "progress",
    shortDescription:
      "A private university memories and community application engineered for students to preserve, catalog, and share daily campus moments and memories.",
    technologies: ["React Native", "Expo", "Node.js", "Express.js"],
    githubUrl: "https://github.com/AnusAfzal/Moment-mobile", // Placeholder repo link
    githubPlaceholder: true,
    demoUrl: null,
    highlights: [
      "Private campus timeline",
      "Node.js API for media management",
      "Focused on privacy and community",
    ],
  },
  {
    id: "blog-website",
    number: "03",
    name: "Blog Website",
    category: "Full Stack",
    categoryLabel: "Full-Stack Web App",
    status: "Completed",
    statusType: "complete",
    shortDescription:
      "A dynamic server-side rendered blogging application built with Node.js and Express.js, featuring content creation, dynamic routing, and database storage.",
    technologies: ["Node.js", "Express.js", "EJS", "MongoDB", "CSS3"],
    githubUrl: "https://github.com/AnusAfzal/Web-Development-Projects/tree/main/Backend/Blog%20Website", // Placeholder repo link
    githubPlaceholder: true,
    demoUrl: null,
    highlights: [
      "Server-side templating with EJS",
      "CRUD operations for articles",
      "Structured MVC backend architecture",
    ],
  },
  {
    id: "weather-app",
    number: "04",
    name: "Weather API Application",
    category: "Frontend",
    categoryLabel: "Frontend & API Integration",
    status: "Completed",
    statusType: "complete",
    shortDescription:
      "A responsive meteorological application integrating third-party weather APIs to deliver real-time atmospheric data, temperature forecasts, and dynamic condition displays.",
    technologies: ["JavaScript", "Weather API", "HTML5", "CSS3"],
    githubUrl: "https://github.com/AnusAfzal/Web-Development-Projects/tree/main/Frontend/Weather%20App", // Placeholder repo link
    githubPlaceholder: true,
    demoUrl: null,
    highlights: [
      "Live weather data fetching via REST API",
      "City search with dynamic condition UI",
      "Responsive layout for mobile and desktop",
    ],
  },
  {
    id: "spotify-clone",
    number: "05",
    name: "Spotify Clone",
    category: "Frontend",
    categoryLabel: "Frontend Web Application",
    status: "Completed",
    statusType: "complete",
    shortDescription:
      "A frontend interface recreation of the popular music streaming service, highlighting component hierarchy, modern layout architecture, and audio player controls.",
    technologies: ["React", "JavaScript", "CSS3", "HTML5"],
    githubUrl: "https://github.com/AnusAfzal/Spotify-Clone", // Placeholder repo link
    githubPlaceholder: true,
    demoUrl: null,
    highlights: [
      "Faithful dark theme UI recreation",
      "Interactive audio controls and track listing",
      "Component-driven React layout",
    ],
  },
  {
    id: "amazon-clone",
    number: "06",
    name: "Amazon Clone",
    category: "Frontend",
    categoryLabel: "E-Commerce Frontend",
    status: "Completed",
    statusType: "complete",
    shortDescription:
      "An e-commerce web platform clone replicating Amazon's core storefront experience, featuring product grid displays, shopping cart management, and price calculations.",
    technologies: ["React", "JavaScript", "CSS3", "HTML5"],
    githubUrl: "https://github.com/AnusAfzal/Web-Development-Projects/tree/main/Frontend/Amazon%20Replica", // Placeholder repo link
    githubPlaceholder: true,
    demoUrl: null,
    highlights: [
      "Interactive cart state management",
      "Responsive e-commerce grid and filtering",
      "Realistic checkout flow simulation",
    ],
  },
];

export const educationData = {
  degree: "Bachelor of Science in Software Engineering",
  shortDegree: "BS Software Engineering",
  institution: "UBIT, University of Karachi",
  department: "Department of Computer Science (UBIT)",
  location: "Karachi, Pakistan",
  description:
    "Undergraduate curriculum emphasizing software architecture, data structures, algorithms, database systems, web engineering, and core computing foundations.",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming (OOP)",
    "Database Management Systems (DBMS)",
    "Web Engineering & Technologies",
    "Software Engineering Principles",
    "Computer Networks & Architecture",
  ],
  principles: [
    {
      title: "Clean Code & Modularity",
      detail:
        "Writing readable, maintainable, and well-structured code adhering to sound software engineering practices.",
    },
    {
      title: "Strong Foundations",
      detail:
        "Grounded understanding of fundamental algorithms, relational schemas, and asynchronous execution models.",
    },
    {
      title: "Hands-on Implementation",
      detail:
        "Translating academic theory into functional, tested, and deployable software applications.",
    },
  ],
};
