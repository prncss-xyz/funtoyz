import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	run: {
		tasks: {
			build: { command: 'vp build' },
			dev: {
				cache: false,
				command: 'vp preview',
			},
			gen: { command: 'node scripts/generate-exports.mjs' },
			tsc: { command: 'tsc --noEmit' },
		},
	},
})
