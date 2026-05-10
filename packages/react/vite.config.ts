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
			build: { command: 'vp pack' },
			dev: {
				cache: false,
				command: 'vp pack --watch',
			},
			gen: { command: 'node scripts/generate-exports.mjs' },
			tsc: { command: 'tsc --noEmit' },
		},
	},
})
