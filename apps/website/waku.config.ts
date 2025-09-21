import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'waku/config'

import * as MdxConfig from './source.config.js'

export default defineConfig({
	vite: {
		plugins: [tailwindcss(), mdx(MdxConfig), tsconfigPaths()] as any,
	},
})
