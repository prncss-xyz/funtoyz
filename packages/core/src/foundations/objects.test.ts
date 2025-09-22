import { merge } from './objects'

describe('merge', () => {
	test('basic', () => {
		expect(merge({ a: 1, b: 2 }, { b: 3 })).toEqual({ a: 1, b: 3 })
	})
	test('preserve reference when equal', () => {
		const a = { a: 1 }
		expect(merge(a, { a: 1 })).toBe(a)
		expect(merge(a, {})).toBe(a)
	})
})
