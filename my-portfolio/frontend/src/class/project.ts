export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  links: {
    demo: string;
    github: string;
  };
  reverse: boolean;
}
