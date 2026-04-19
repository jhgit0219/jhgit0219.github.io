export interface ProjectLinks {
  demo?: string;
  github?: string;
}

export interface ProjectStackGroup {
  label: string;
  items: string[];
}

export type ProjectKind = "product" | "lab";

export type ProjectStatus =
  | "live"
  | "in-progress"
  | "archived"
  | "local";

export interface Project {
  id: number;
  slug: string;
  kind: ProjectKind;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  links: ProjectLinks;
  tags: string[];
  language?: string;
  reverse: boolean;
  role: string;
  year: string;
  status: ProjectStatus;
  highlights: string[];
  techStack: ProjectStackGroup[];
  challenges: string[];
  gallery?: string[];
}
