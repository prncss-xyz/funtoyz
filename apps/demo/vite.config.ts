import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	run: {
		tasks: {
			tsc: { command: 'tsc --noEmit' },
			build: { command: 'vp build' },
			gen: { command: 'node scripts/generate-exports.mjs' },
			dev: {
				command: 'vp preview',
				cache: false,
			},
		},
	},
})
