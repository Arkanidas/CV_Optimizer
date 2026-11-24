import {
  Car,
  ClipboardList,
  Clapperboard,
  Code,
  Cog,
  Dumbbell,
  Factory,
  FlaskConical,
  GraduationCap,
  HardHat,
  HeartHandshake,
  HeartPulse,
  Home,
  Leaf,
  Megaphone,
  Palette,
  Plane,
  PlusCircle,
  RadioTower,
  Scale,
  Scissors,
  ShieldCheck,
  Sprout,
  Store,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// INDUSTRIES (TWEAK ZONE)
// ============================================================
// To add an industry, add one object to the list. Give it an unique id, a
// label, an icon from lucide-react, and its popular job titles (five or six).
// The list is shown ten at a time, in this order, so every ten industries
// make one more page. If an icon name is underlined as missing in your version
// of lucide-react, swap it for any other icon.
//
// The last entry is the "Other / Custom Role" option. Keep it last, and keep
// custom: true on it. It has no job titles: the person types their own.
export interface Industry {
  id: string;
  label: string;
  icon: LucideIcon;
  occupations: string[];
  // true for the "Other / Custom Role" option. It isn't a real industry.
  custom?: boolean;
}

// How many industries there are on each page of the list
export const INDUSTRIES_PER_PAGE = 10;

export const INDUSTRIES: Industry[] = [
  {
    id: "technology",
    label: "Technology & IT",
    icon: Code,
    occupations: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Software Engineer",
      "DevOps Engineer",
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: Cog,
    occupations: [
      "Mechanical Engineer",
      "Electrical Engineer",
      "Civil Engineer",
      "Industrial Engineer",
      "Project Engineer",
    ],
  },
  {
    id: "business-finance",
    label: "Business & Finance",
    icon: TrendingUp,
    occupations: [
      "Financial Analyst",
      "Accountant",
      "Business Analyst",
      "Project Manager",
      "Management Consultant",
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: HeartPulse,
    occupations: [
      "Registered Nurse",
      "Physician",
      "Pharmacist",
      "Physical Therapist",
      "Healthcare Assistant",
    ],
  },
  {
    id: "marketing-media",
    label: "Marketing & Media",
    icon: Megaphone,
    occupations: [
      "Marketing Manager",
      "Content Creator",
      "Social Media Manager",
      "Graphic Designer",
      "SEO Specialist",
    ],
  },
  {
    id: "sales-customer-service",
    label: "Sales & Customer Service",
    icon: Users,
    occupations: [
      "Sales Representative",
      "Account Manager",
      "Customer Support Specialist",
      "Customer Success Manager",
      "Sales Manager",
    ],
  },
  {
    id: "retail-hospitality",
    label: "Retail & Hospitality",
    icon: Store,
    occupations: [
      "Retail Sales Associate",
      "Store Manager",
      "Waiter / Waitress",
      "Bartender",
      "Hotel Receptionist",
    ],
  },
  {
    id: "construction-trades",
    label: "Construction & Trades",
    icon: HardHat,
    occupations: [
      "Electrician",
      "Carpenter",
      "Plumber",
      "Construction Worker",
      "Site Manager",
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    occupations: [
      "Teacher",
      "Teaching Assistant",
      "Lecturer",
      "School Counselor",
      "Preschool Teacher",
    ],
  },
  {
    id: "logistics-transportation",
    label: "Logistics & Transportation",
    icon: Truck,
    occupations: [
      "Warehouse Worker",
      "Truck Driver",
      "Logistics Coordinator",
      "Delivery Driver",
      "Supply Chain Analyst",
    ],
  },

  // ---- page 2 ----
  {
    id: "science-research",
    label: "Science & Research",
    icon: FlaskConical,
    occupations: [
      "Research Scientist",
      "Laboratory Technician",
      "Biologist",
      "Chemist",
      "Research Associate",
      "Physicist",
    ],
  },
  {
    id: "manufacturing-production",
    label: "Manufacturing & Production",
    icon: Factory,
    occupations: [
      "Production Operator",
      "Production Manager",
      "Assembly Technician",
      "CNC Operator",
      "Quality Control Inspector",
      "Manufacturing Engineer",
    ],
  },
  {
    id: "energy-utilities",
    label: "Energy & Utilities",
    icon: Zap,
    occupations: [
      "Renewable Energy Engineer",
      "Solar Panel Technician",
      "Wind Turbine Technician",
      "Power Systems Engineer",
      "Energy Analyst",
      "Utility Technician",
    ],
  },
  {
    id: "legal-services",
    label: "Legal Services",
    icon: Scale,
    occupations: [
      "Lawyer / Attorney",
      "Legal Assistant",
      "Paralegal",
      "Legal Counsel",
      "Compliance Officer",
      "Contract Manager",
    ],
  },
  {
    id: "hr-recruitment",
    label: "Human Resources & Recruitment",
    icon: UserCheck,
    occupations: [
      "HR Specialist",
      "HR Manager",
      "Recruiter",
      "Talent Acquisition Specialist",
      "HR Business Partner",
      "Payroll Specialist",
    ],
  },
  {
    id: "administration-office",
    label: "Administration & Office Management",
    icon: ClipboardList,
    occupations: [
      "Administrative Assistant",
      "Office Manager",
      "Executive Assistant",
      "Data Entry Clerk",
      "Operations Coordinator",
      "Personal Assistant",
    ],
  },
  {
    id: "real-estate-property",
    label: "Real Estate & Property Management",
    icon: Home,
    occupations: [
      "Real Estate Agent",
      "Property Manager",
      "Real Estate Analyst",
      "Leasing Consultant",
      "Property Administrator",
      "Facilities Manager",
    ],
  },
  {
    id: "security-protective",
    label: "Security & Protective Services",
    icon: ShieldCheck,
    occupations: [
      "Security Guard",
      "Security Officer",
      "Close Protection Officer",
      "Security Manager",
      "Surveillance Operator",
      "Fire Safety Officer",
    ],
  },
  {
    id: "agriculture-forestry-fishing",
    label: "Agriculture, Forestry & Fishing",
    icon: Sprout,
    occupations: [
      "Agricultural Worker",
      "Farm Manager",
      "Agricultural Technician",
      "Agronomist",
      "Forestry Worker",
      "Fisheries Technician",
    ],
  },
  {
    id: "arts-design-creative",
    label: "Arts, Design & Creative Industries",
    icon: Palette,
    occupations: [
      "UI/UX Designer",
      "Product Designer",
      "Illustrator",
      "Photographer",
      "Animator",
      "Industrial Designer",
    ],
  },

  // ---- page 3 ----
  {
    id: "entertainment-film-music",
    label: "Entertainment, Film & Music",
    icon: Clapperboard,
    occupations: [
      "Film Director",
      "Camera Operator",
      "Sound Engineer",
      "Video Producer",
      "Music Producer",
      "Production Assistant",
    ],
  },
  {
    id: "automotive-vehicle",
    label: "Automotive & Vehicle Services",
    icon: Car,
    occupations: [
      "Automotive Mechanic",
      "Vehicle Technician",
      "Auto Electrician",
      "Automotive Engineer",
      "Service Advisor",
      "Vehicle Inspector",
    ],
  },
  {
    id: "sports-fitness-recreation",
    label: "Sports, Fitness & Recreation",
    icon: Dumbbell,
    occupations: [
      "Personal Trainer",
      "Fitness Instructor",
      "Sports Coach",
      "Sports Scientist",
      "Athletic Trainer",
      "Recreation Coordinator",
    ],
  },
  {
    id: "beauty-wellness-personal-care",
    label: "Beauty, Wellness & Personal Care",
    icon: Scissors,
    occupations: [
      "Hairdresser",
      "Barber",
      "Makeup Artist",
      "Beauty Therapist",
      "Massage Therapist",
      "Nail Technician",
    ],
  },
  {
    id: "social-services-nonprofit",
    label: "Social Services & Nonprofit Organizations",
    icon: HeartHandshake,
    occupations: [
      "Social Worker",
      "Case Manager",
      "Youth Worker",
      "Community Coordinator",
      "NGO Project Manager",
      "Support Worker",
    ],
  },
  {
    id: "travel-tourism",
    label: "Travel & Tourism",
    icon: Plane,
    occupations: [
      "Travel Consultant",
      "Tour Guide",
      "Travel Agent",
      "Tourism Manager",
      "Flight Attendant",
      "Destination Coordinator",
    ],
  },
  {
    id: "telecommunications",
    label: "Telecommunications",
    icon: RadioTower,
    occupations: [
      "Network Engineer",
      "Telecommunications Technician",
      "Fiber Optic Technician",
      "Network Administrator",
      "Radio Frequency Engineer",
      "Telecom Project Manager",
    ],
  },
  {
    id: "environment-sustainability",
    label: "Environment & Sustainability",
    icon: Leaf,
    occupations: [
      "Environmental Engineer",
      "Sustainability Specialist",
      "Environmental Consultant",
      "Climate Analyst",
      "Environmental Scientist",
      "Waste Management Specialist",
    ],
  },
  {
    id: "food-production-services",
    label: "Food Production & Food Services",
    icon: UtensilsCrossed,
    occupations: [
      "Food Production Worker",
      "Food Technologist",
      "Quality Assurance Technician",
      "Food Safety Specialist",
      "Production Supervisor",
      "Food Processing Operator",
    ],
  },

  // The last tile: for people who can't find their role in any industry above
  {
    id: "other-custom",
    label: "Other / Custom Role",
    icon: PlusCircle,
    occupations: [],
    custom: true,
  },
];

// ============================================================
// EXPERIENCE LEVELS (TWEAK ZONE)
// ============================================================
// "years" is shown on the page after the name, for example "Junior (1-3 years)".
export interface ExperienceLevel {
  id: string;
  label: string;
  years: string;
}

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { id: "entry", label: "Entry level / No experience", years: "0-1 years" },
  { id: "junior", label: "Junior", years: "1-3 years" },
  { id: "intermediate", label: "Intermediate", years: "3-5 years" },
  { id: "senior", label: "Senior", years: "5-10 years" },
  { id: "executive", label: "Executive", years: "10+ years" },
];

// What the page holds while the user chooses
export interface CareerSelection {
  industryId: string | null;
  // A title picked from the popular list, or one the user typed
  occupation: string;
  experienceId: string | null;
}

export const EMPTY_CAREER: CareerSelection = {
  industryId: null,
  occupation: "",
  experienceId: null,
};