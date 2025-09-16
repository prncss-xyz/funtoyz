import type { NextConfig } from 'next'

import { basePath } from '@funtoyz/config'

const nextConfig: NextConfig = {
	basePath,
	output: 'export',
}

export default nextConfig
