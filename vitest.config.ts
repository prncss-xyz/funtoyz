import { sharedVitest } from '@funtoyz/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	...sharedVitest,
	test: {
		...sharedVitest.test,
	},
})
