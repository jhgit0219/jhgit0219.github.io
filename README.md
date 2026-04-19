# jhgit0219.github.io

My personal portfolio site. Showcases selected work across full-stack, applied AI, test automation, and data projects.

## What is on the site

The site is a single scrolling page plus one detail page per project. Sections, top to bottom:

- **Hero** — cursor-reactive spotlight over a red smoke background.
- **About** — bio, four pillars (frontend, backend, applied AI, test automation), career timeline, education, and recognition.
- **Skills** — seven grouped toolkit cards covering the actual stack I work in, from React and FastAPI to PEGA and Playwright.
- **Projects** — the work I want to lead with, with rich writeups per project.
- **Lab** — backend services, ML pipelines, and scripts that do not come with a polished UI. Terminal-styled cards.
- **Contact** — email, GitHub, LinkedIn, and a message form embedded in a laptop illustration.

Each project card links to a dedicated detail page with an expanded writeup, a grouped stack breakdown, highlights, challenges, and prev/next navigation.

## Structure

```text
src/
  app/                     Next.js App Router
    layout.tsx             Root layout, fonts, metadata
    page.tsx               Home page, composes every section
    projects/[slug]/       Dynamic detail page per project
  components/              Section and shared UI components
  hooks/                   useSectionNavigation (transform-safe scroll)
  class/                   Shared types
  data/                    projects.json (single source of truth for all projects)
  styles/                  Global CSS
  utils/                   Form validation helpers
public/
  images/                  Project screenshots, hero background, device mockups
```

Every project on the site is an entry in [src/data/projects.json](src/data/projects.json). Adding a project is one JSON object plus an image in `public/images/`.

## Stack

- [Next.js 16](https://nextjs.org/) App Router on React 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for scroll-linked reveals and tilt interactions
- [react-intersection-observer](https://www.npmjs.com/package/react-intersection-observer) for lazy reveal triggers
- [react-icons](https://react-icons.github.io/react-icons/) for icon sets

## Design notes

- Dark, red-accented theme with dim ember-glow decorative lines between sections.
- Cursor spotlight, image tilt on hover, and a sidebar that fades in after the hero.
- Scroll-linked reveal animations via Framer Motion. Nav-click scrolling uses a transform-safe `offsetTop` walk so section targets land correctly even while a parent motion wrapper is mid-animation.
- Navigation has two modes: fixed left sidebar on desktop, top navbar on mobile. Section targets are mirrored between them through a single `useSectionNavigation` hook.

## Deployment

The site deploys to [jhgit0219-github-io.vercel.app](https://jhgit0219-github-io.vercel.app/).

## License

All content, screenshots, and copy on this site are owned by me. Code in this repository is shared for transparency, not as a template.
