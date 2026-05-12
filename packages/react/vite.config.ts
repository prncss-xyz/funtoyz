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
			'gen:exports': {
				command: 'gen-exports',
				input: [
					'src/**/*.ts',
					'src/**/*.tsx',
					'!src/index.ts',
					'!src/index.tsx',
				],
				cache: true,
			},
			tsc: { command: 'tsc --noEmit' },
		},
	},
})
