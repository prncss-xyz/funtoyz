import { describe, expect, it, vi } from 'vitest'

import { clearCollectionEntries, collection } from './collection'

describe('collection', () => {
	it('should create and retrieve items', () => {
		const factory = vi.fn((key: string) => ({ id: key, value: Math.random() }))
		const col = collection(factory)

		const item1 = col.get('a')
		expect(factory).toHaveBeenCalledTimes(1)
		expect(item1.id).toBe('a')

		const item2 = col.get('a')
		expect(factory).toHaveBeenCalledTimes(1) // Should use cached
		expect(item2).toBe(item1)

		const item3 = col.get('b')
		expect(factory).toHaveBeenCalledTimes(2)
		expect(item3.id).toBe('b')
	})

	it('should iterate over items', () => {
		const col = collection((key: string) => ({ id: key }))
		col.get('a')
		col.get('b')
		col.get('c')

		const keys: string[] = []
		col.forEach((key, payload) => {
			keys.push(key)
			expect(payload.id).toBe(key)
		})

		expect(keys).toContain('a')
		expect(keys).toContain('b')
		expect(keys).toContain('c')
		expect(keys.length).toBe(3)
	})

	it('should clear entries based on filter', () => {
		const factory = vi.fn((key: string) => ({ id: key }))
		const col = collection(factory)

		col.get('a')
		col.get('b')
		col.get('c')
		expect(factory).toHaveBeenCalledTimes(3)

		// Clear only 'a' and 'c'
		clearCollectionEntries((key) => key === 'a' || key === 'c')

		// 'b' should remain cached
		col.get('b')
		expect(factory).toHaveBeenCalledTimes(3)

		// 'a' should be re-created
		col.get('a')
		expect(factory).toHaveBeenCalledTimes(4)

		// 'c' should be re-created
		col.get('c')
		expect(factory).toHaveBeenCalledTimes(5)
	})
})
