import { defineConfig } from 'tsdown'

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
