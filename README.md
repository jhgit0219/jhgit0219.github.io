# Personal Portfolio Website

This is my personal portfolio website built using **Next.js (App Router)**, **Tailwind CSS**, and **Framer Motion**. The site is designed to showcase my projects, experience, and a custom contact section with interactive visual elements and smooth animations.

## Features

- Animated hero section with scroll-triggered transitions
- Interactive feature highlights with full-width hover effects
- Custom spotlight cursor effect
- CSS-based smoke background for visual depth
- Responsive layout with sidebar navigation on desktop and a top navbar on mobile
- Reusable scroll logic with `useRef` and `IntersectionObserver`
- Contact section:
  - Left: vertically stacked social links with icons and a heading
  - Right: message form embedded in a large laptop illustration
  - Integrated with a free external form API (no backend required)

## Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: Free form submission API
- **Storage**: Firebase Cloud Storage for image assets
- **Hooks**: Custom React hooks for scroll and visibility logic

## Getting Started

```bash
# Clone the repository
git clone https://github.com/jhgit0219/jhgit0219.github.io.git

# Navigate to the project directory
cd my-portfolio/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
