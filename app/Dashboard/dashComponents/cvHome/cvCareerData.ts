import {
  Code,
  Cog,
  GraduationCap,
  HardHat,
  HeartPulse,
  Megaphone,
  Store,
  TrendingUp,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";


export interface Industry {
  id: string;
  label: string;
  icon: LucideIcon;
  occupations: string[];
}

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
];


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


export interface CareerSelection {
  industryId: string | null;
  occupation: string;
  experienceId: string | null;
}

export const EMPTY_CAREER: CareerSelection = {
  industryId: null,
  occupation: "",
  experienceId: null,
};