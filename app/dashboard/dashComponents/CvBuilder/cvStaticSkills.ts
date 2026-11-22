// ============================================================
// STATIC PLACEHOLDER CONTENT
// ============================================================
// Everything in this file is temporary. Later the AI generates these lists for
// the role the user chose, and the page passes them to the step instead. The
// step itself only ever reads a SkillRecommendations object, so replacing the
// call in the page is the only change needed there.
//
// Only two roles have content. Any other role gets the general soft skills and
// empty lists for the rest, which the step shows as "coming soon", so a role
// never gets another role's skills.

export interface SkillRecommendations {
  technical: string[];
  competences: string[];
  soft: string[];
  // The "In demand for this role" list in the side panel
  inDemand: string[];
}

const GENERAL_SOFT_SKILLS = [
  "Communication",
  "Teamwork",
  "Problem-solving",
  "Adaptability",
  "Time management",
  "Attention to detail",
];

const FULL_STACK_DEVELOPER: SkillRecommendations = {
  technical: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Next.js",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "Git",
    "Docker",
  ],
  competences: [
    "Full-stack development",
    "API development",
    "Database design",
    "System integration",
    "Frontend development",
    "Performance optimization",
    "Testing & debugging",
    "Software architecture",
    "Agile development",
    "Version control & CI/CD",
    "Team collaboration",
  ],
  soft: GENERAL_SOFT_SKILLS,
  inDemand: [
    "Full-stack development (frontend & backend)",
    "Modern frameworks (e.g. React, Next.js)",
    "API and database experience",
    "Version control (Git) and deployment (Docker, CI/CD)",
  ],
};

const STORE_MANAGER: SkillRecommendations = {
  technical: [
    "POS systems",
    "Inventory management",
    "Microsoft Excel",
    "Scheduling software",
    "Sales reporting",
    "Visual merchandising",
    "Payroll basics",
    "E-commerce platforms",
  ],
  competences: [
    "Team leadership",
    "Staff scheduling",
    "Inventory control",
    "Sales strategy",
    "Customer service",
    "Budgeting & cost control",
    "Loss prevention",
    "Training & coaching",
    "Operations management",
    "Conflict resolution",
    "Visual merchandising",
  ],
  soft: [
    "Leadership",
    "Communication",
    "Problem-solving",
    "Adaptability",
    "Time management",
    "Customer focus",
  ],
  inDemand: [
    "Team leadership and scheduling",
    "Inventory and stock control",
    "Sales and budget responsibility",
    "Customer service excellence",
  ],
};

const BY_ROLE: Record<string, SkillRecommendations> = {
  "full stack developer": FULL_STACK_DEVELOPER,
  "store manager": STORE_MANAGER,
};

export function getStaticRecommendations(occupation: string): SkillRecommendations {
  return (
    BY_ROLE[occupation.trim().toLowerCase()] ?? {
      technical: [],
      competences: [],
      soft: GENERAL_SOFT_SKILLS,
      inDemand: [],
    }
  );
}