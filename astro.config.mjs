import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The live address: used for canonical links and the sitemap.
  site: 'https://dragosgeica.com',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/admin') })],
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
