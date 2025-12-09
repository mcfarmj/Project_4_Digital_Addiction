import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  // MUST match your GitHub repo name
  base: '/project_4_digital_addiction/'
});
