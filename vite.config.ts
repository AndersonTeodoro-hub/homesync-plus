import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Safe way to get CWD that works in Node and some browser-based shims
  const cwd = typeof process !== 'undefined' && typeof (process as any).cwd === 'function' ? (process as any).cwd() : '.';
  const env = loadEnv(mode, cwd, '');
  
  // Ensure API KEY exists to avoid build crashes, prioritizing process.env for Vercel
  const apiKey = env.API_KEY || (typeof process !== 'undefined' ? process.env?.API_KEY : '') || '';

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});