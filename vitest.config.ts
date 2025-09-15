import { vitestBase } from '@funtoyz/base'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	...vitestBase,
	test: {
		...vitestBase.test,
	},
})
