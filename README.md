Humartz Music

🎵 Humartz Music is a modern music platform built with Next.js and a Turborepo monorepo, designed to showcase music content, streams, and interactive features.

🚀 Live demo: humartz-music-web.vercel.app

Table of Contents

About

Features

Tech Stack

Getting Started

Development

Deployment

Contributing

License

About

Humartz Music is a scalable, production-grade Next.js application structured as a Turborepo. It’s optimized for modern music web experiences, providing a solid foundation for interactive music apps with minimal setup.

Features

Scalable monorepo structure

Next.js frontend application

Tailwind CSS support (via TWBlocks)

TypeScript for type safety

Shared packages/utilities across apps

Optimized for Vercel deployment

Tech Stack

Next.js — React framework for SSR/SSG hybrid apps

TypeScript — Type-safe JavaScript

Turborepo — Monorepo tooling for multiple apps/packages

pnpm — Fast, efficient package manager

Vercel — Hosting and deployments

Getting Started
Prerequisites
node >= 18
pnpm >= 8


Clone the repo:

git clone https://github.com/CoponatRecords/humartz-music.git
cd humartz-music


Install dependencies:

pnpm install

Development

Start the development environment with hot-reloading:

pnpm dev


Build for production:

pnpm build


Run production locally:

pnpm start

Deployment

Designed for Vercel deployment:

Connect the repo in Vercel dashboard.

Add any required environment variables.

Deploy — Vercel automatically detects Turborepo structure.

You can also use the CLI:

vercel --prod

Contributing

Contributions are welcome:

Fork the repository

Create a feature branch: git checkout -b feature/your-feature

Commit your changes

Open a Pull Request

Include tests & documentation when appropriate.

License

This project is licensed under the MIT License — see LICENSE
.