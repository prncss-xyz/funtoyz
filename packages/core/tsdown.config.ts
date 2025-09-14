import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['src/**/*.{js,ts,jsx,tsx}', '!**/*.test.*'],
	exports: true,
	failOnWarn: true,
})
