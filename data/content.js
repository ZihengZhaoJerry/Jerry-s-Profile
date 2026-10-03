/*
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Edit this file to update your profile, resume, and projects.
 *  Any field can be omitted (or left empty) and its UI is hidden.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE_CONTENT = {
  profile: {
    name: "Jerry Zhao",
    title: "Software Developer · BCIT Computer Systems Technology",
    location: "Vancouver, BC",
    // Path or URL to a headshot (e.g. "assets/headshot.jpg"). Leave empty to show initials.
    photo: "",
    summary:
      "Computer Systems Technology student at BCIT (graduating Jan. 2027) with a UBC Honours B.Sc. " +
      "in Cellular, Anatomical and Physiological Sciences. I moved from single-cell cancer research " +
      "into software, and I enjoy building responsive full-stack web apps, leading small teams, and " +
      "explaining technical ideas clearly. I learned that last part as a Science Interpreter at the " +
      "H.R. MacMillan Space Centre.",
    contacts: [
      { label: "Email", value: "zzhao80@my.bcit.ca", url: "mailto:zzhao80@my.bcit.ca" },
      { label: "GitHub", value: "ZihengZhaoJerry", url: "https://github.com/ZihengZhaoJerry" },
      { label: "LinkedIn", value: "ziheng-zhao", url: "https://www.linkedin.com/in/ziheng-zhao" },
    ],
    // Optional: link to a downloadable PDF resume (e.g. "assets/resume.pdf").
    resumePdf: "",
  },

  resume: {
    experience: [
      {
        role: "Science Interpreter",
        org: "H.R. MacMillan Space Centre",
        location: "Vancouver, BC",
        start: "June 2024",
        end: "Present",
        bullets: [
          "Collaborated on content creation, enhancing public understanding of astrophysics.",
          "Inspired STEM curiosity through interactive demos, increasing repeat visits.",
        ],
      },
      {
        role: "Research Analyst",
        org: "University of British Columbia",
        location: "Vancouver, BC",
        start: "Sept 2023",
        end: "Apr 2024",
        bullets: [
          "Analyzed single-cell data using R and Loupe Browser for cancer research.",
          "Validated biomarkers via immunofluorescence with 98% accuracy.",
          "Provided insights that accelerated hypothesis testing, advancing targeted cancer therapies.",
        ],
      },
    ],
    education: [
      {
        degree: "Diploma in Computer Systems Technology (CST)",
        school: "British Columbia Institute of Technology (BCIT)",
        end: "Graduating Jan. 2027",
      },
      {
        degree: "Honours B.Sc., Cellular, Anatomical and Physiological Sciences",
        school: "University of British Columbia (UBC)",
        end: "Class of 2024",
      },
    ],
    skills: [
      { group: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "HTML/CSS", "SQL", "C", "R"] },
      { group: "Frameworks & Libraries", items: ["React.js", "Node.js", "Express", "Tailwind CSS", "Bootstrap 5"] },
      { group: "Tools & Platforms", items: ["Git", "Figma", "Framer", "VS Code", "MySQL", "Firebase", "MongoDB", "Render"] },
      { group: "Concepts & Practices", items: ["OOP", "Agile Development", "Version Control"] },
    ],
    awards: [],
  },

  projects: [
    {
      name: "Song Request System",
      year: "Oct 2025",
      summary: "Live song-request app built at the StormHacks 2025 hackathon.",
      description:
        "Built a responsive React (Vite) app for live song requests, integrating APIs for song fetching " +
        "and queue management. Delivered the MVP in 24 hours using agile practices and Git. " +
        "Proposed an AI integration that matches song beats with phone light effects.",
      tags: ["React", "Tailwind CSS", "Hackathon"],
      links: [{ label: "Code", url: "https://github.com/ZihengZhaoJerry/StormHeck2025" }],
      featured: true,
    },
    {
      name: "H.R. MacMillan Space Centre Website",
      year: "Jul – Sep 2025",
      summary: "Project Lead: designed and deployed a responsive site for the Space Centre.",
      description:
        "Designed the site in Figma and deployed it with Framer, ensuring cross-device compatibility. " +
        "Built interactive UI components for a better visitor experience.",
      tags: ["Framer", "Figma", "JavaScript", "Design"],
      links: [],
      featured: true,
    },
    {
      name: "HUH! — Slang Learning Platform",
      year: "Jan – Jun 2025",
      summary: "Project Lead: a web platform for learning and sharing local slang.",
      description:
        "Led a team through a full-stack build with Node.js, Express and MongoDB, deployed on Render. " +
        "Implemented a responsive UI, real-time chat, slang games, and Firebase authentication. " +
        "Users can post, edit and search slang entries, comment on others' posts, and get real-time notifications.",
      tags: ["Node.js", "MongoDB", "Firebase", "JavaScript"],
      links: [{ label: "Code", url: "https://github.com/ZihengZhaoJerry/1800_202510_BBY17" }],
    },
  ],
};
