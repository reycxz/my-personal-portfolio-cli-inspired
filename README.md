# Rey Lorenz Cabanog Portfolio

[![Astro](https://img.shields.io/badge/Astro-FF5A03?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

Source code for Rey Lorenz Cabanog's terminal-inspired portfolio. This site showcases Rey's full-stack development work, cybersecurity interests, GitHub projects, resume, and blog content in a command-line style interface built with Astro.

[![Demo](docs/demo.gif)](docs/demo.gif)

## Overview

This portfolio is built to present:

- Rey's terminal-style landing page and interactive command navigation
- Featured and full GitHub project listings
- Resume and background in development plus cybersecurity
- Blog content written in Markdown and MDX
- A `ping me` contact modal with a secure server-side Gemini-backed assistant

## Profile Snapshot

- Name: Rey Lorenz Cabanog
- Role: Full Stack Developer and Cyber Security Enthusiast
- Location: Navotas City, PH
- Focus: Laravel, React.js, Python, DFIR, SOC operations, and secure web systems
- GitHub: <https://github.com/reycxz>
- LinkedIn: <https://www.linkedin.com/in/reylorenzc/>
- Email: <mailto:reylorenzc@gmail.com>

## Tech Stack

- Astro 5
- TypeScript
- Tailwind CSS
- MDX
- Sharp
- Highlight.js
- Vercel serverless adapter

## Key Features

- Interactive terminal UI on the home page
- Responsive mobile-first layout across home, projects, resume, and blog pages
- Persistent theme switching across navigation
- GitHub project data rendered from static portfolio data
- Contact modal with quick links and mail draft support
- Secure server-side chat endpoint for Gemini integration
- Blog system with featured posts and RSS support

## Local Development

### Prerequisites

- Node.js 24.x recommended for Vercel parity
- npm

### Install

```bash
git clone https://github.com/reycxz/my-personal-portfolio-cli-inspired.git
cd my-personal-portfolio-cli-inspired
npm install
```

### Environment Variables

Create a root `.env` file and add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Notes:

- The portfolio now uses a private server-side endpoint for chat.
- Do not use `PUBLIC_GEMINI_API_KEY` for deployment.
- If Gemini returns `429`, the app falls back to the local portfolio-aware assistant.

### Run Locally

```bash
npm run dev
```

By default Astro runs locally at `http://localhost:4321` unless that port is already in use.

### Build

```bash
npm run build
```

Because this project uses the Vercel adapter, `npm run preview` is not the local verification path. Use `npm run dev` for local testing.

## Deployment

### Vercel

This repository is configured for Vercel serverless deployment.

1. Import the repository into Vercel.
2. In Project Settings, add the environment variable `GEMINI_API_KEY`.
3. Trigger a deployment.

The chat assistant will call Gemini from the server side through `src/pages/api/ask-rey.ts`, which keeps the key out of the browser.

## Updating Portfolio Data

### GitHub Projects

To refresh GitHub repository data:

```bash
npm run update-github
```

This updates the portfolio project data used by the projects page.

### Resume

To re-import resume content:

```bash
npm run import-resume
```

### Main Portfolio Configuration

Most portfolio content is driven from:

- `profile.config.ts`
- `src/data/resume.ts`
- `src/content/blog/`

## Project Structure

```text
src/
├── components/         # Shared Astro components
├── content/blog/       # Blog posts
├── data/               # Resume and GitHub data
├── layouts/            # Page layouts
├── pages/              # Home, projects, resume, blogs, API routes
├── styles/             # Global styles
└── utils/              # Theme and markdown helpers

public/
├── fonts/
├── images/
└── _redirects
```

## Available Scripts

- `npm run dev` - Start the local dev server
- `npm run build` - Build the production output for Vercel
- `npm run astro` - Run Astro CLI commands
- `npm run update-github` - Refresh GitHub project data
- `npm run import-resume` - Re-import resume content

## Pages and Sections

- `/` - Terminal landing page
- `/projects` - GitHub repositories and featured work
- `/resume` - Resume page
- `/blogs` - Blog index
- `/blogs/[slug]` - Individual blog posts
- `/api/ask-rey` - Secure server-side assistant endpoint

## Notes

- The UI is intentionally terminal-inspired, but the content is centered on Rey's current portfolio and career direction.
- The assistant is designed to answer portfolio-specific questions, not act as a general chatbot.
- If Gemini is unavailable, the assistant degrades gracefully instead of failing the contact experience.

## License

This repository is licensed under the MIT License. See [LICENSE](LICENSE).
