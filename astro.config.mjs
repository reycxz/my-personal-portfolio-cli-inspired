// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';
import profileConfig from './profile.config';

// https://astro.build/config
export default defineConfig({
	site: profileConfig.profile.website,
	output: 'server',
	adapter: vercel(),
	integrations: [mdx(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
});