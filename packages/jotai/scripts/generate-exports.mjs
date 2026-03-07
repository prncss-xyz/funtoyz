#!/usr/bin/env node
/* eslint-disable no-undef */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const srcDir = path.join(__dirname, '../src')
const indexPath = path.join(srcDir, 'index.ts')

async function getAllFiles(dir, baseDir = dir) {
	const files = []
	const entries = await fs.readdir(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		const relativePath = path.relative(baseDir, fullPath)

		// Skip files/dirs starting with _
		if (entry.name.startsWith('_')) {
			continue
		}

		if (entry.isDirectory()) {
			files.push(...(await getAllFiles(fullPath, baseDir)))
		} else if (
			(entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
			!entry.name.endsWith('.test.ts') &&
			!entry.name.endsWith('.test.tsx')
		) {
			files.push(relativePath)
		}
	}

	return files
}

async function generateIndex() {
	const files = await getAllFiles(srcDir)

	// Filter out root index.ts itself
	const exports = files
		.filter((file) => file !== 'index.ts' && file !== 'index.tsx')
		.sort()
		.map((file) => {
			// Remove .ts or .tsx extension
			const importPath = file.replace(/\.(ts|tsx)$/, '')
			return `export * from './${importPath}'`
		})

	const content = exports.join('\n') + '\n'

	await fs.writeFile(indexPath, content, 'utf-8')
	console.log(`✓ Generated ${indexPath}`)
	console.log(`✓ Created ${exports.length} export statements`)
}

generateIndex().catch((err) => {
	console.error('Error generating index:', err)
	process.exit(1)
})
