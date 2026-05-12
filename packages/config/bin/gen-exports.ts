#!/usr/bin/env -S node --experimental-strip-types

import { readdir, writeFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

async function getAllFiles(
	dir: string,
	baseDir: string = dir,
): Promise<string[]> {
	const files: string[] = []
	const entries = await readdir(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = join(dir, entry.name)
		const relativePath = relative(baseDir, fullPath)

		// Skip files/dirs starting with _
		if (entry.name.startsWith('_')) {
			continue
		}

		if (entry.isDirectory()) {
			files.push(...(await getAllFiles(fullPath, baseDir)))
		} else if (
			(entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
			!entry.name.endsWith('.test.ts') &&
			!entry.name.endsWith('.test.tsx') &&
			(entry.name !== 'index.ts' || relativePath !== entry.name) &&
			(entry.name !== 'index.tsx' || relativePath !== entry.name) &&
			entry.name !== 'gen-exports.ts'
		) {
			files.push(relativePath)
		}
	}

	return files
}

async function exists(path: string) {
	try {
		await stat(path)
		return true
	} catch {
		return false
	}
}

async function generateIndex(): Promise<void> {
	const cwd = process.cwd()
	const srcDir = join(cwd, 'src')

	let scanDir = cwd
	if (await exists(srcDir)) {
		scanDir = srcDir
	}

	const files = await getAllFiles(scanDir, scanDir)

	const exports = files.sort().map((file) => {
		// Remove .ts or .tsx extension
		const importPath = file.replace(/\.(ts|tsx)$/, '')
		return `export * from './${importPath}'`
	})

	const content = exports.join('\n') + '\n'
	const indexPath = join(scanDir, 'index.ts')

	await writeFile(indexPath, content, 'utf-8')
	// eslint-disable-next-line eslint/no-console
	console.log(`✓ Created ${indexPath} with ${exports.length} export statements`)
}

generateIndex().catch((err: unknown) => {
	// eslint-disable-next-line eslint/no-console
	console.error('Error generating index:', err)
	process.exit(1)
})
