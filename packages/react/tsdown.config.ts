import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
	clean: true,
	dts: true,
	entry: {
		index: './src/index.ts',
	},
	failOnWarn: true,
	platform: 'neutral',
	unbundle: true,
})
