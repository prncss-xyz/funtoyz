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
})
