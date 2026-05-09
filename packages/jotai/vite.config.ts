import { defineConfig } from 'vite-plus'

export default defineConfig({
	pack: {
		clean: true,
		dts: true,
		entry: {
			index: './src/index.ts',
		},
		failOnWarn: true,
		platform: 'neutral',
		unbundle: true,
	},
	run: {
		tasks: {
			tsc: { command: 'tsc --noEmit' },
			build: { command: 'vp pack' },
			gen: { command: 'node scripts/generate-exports.mjs' },
			dev: {
				command: 'vp pack --watch',
				cache: false,
			},
		},
	},
})
