import { defineConfig } from 'tsdown'

export default defineConfig({
	dts: true,
	entry: ['src/**/*.{js,ts,jsx,tsx}', '!**/*.test.*'],
	exports: false,
	failOnWarn: true,
	platform: 'neutral',
})
