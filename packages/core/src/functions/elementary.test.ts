import { always, clamp, eqWith, modulo, not, tuple } from './elementary'

describe('elementary', () => {
	it('clamp works', () => {
		expect(clamp(0, 10, -5)).toBe(0)
		expect(clamp(0, 10, 5)).toBe(5)
		expect(clamp(0, 10, 15)).toBe(10)
		expect(clamp(2, 0, 15)).toBe(2)
	})
	it('tuple works', () => {
		expect(tuple(1, 'a')).toEqual([1, 'a'])
	})
	it('eqWith works', () => {
		const eqLen = eqWith((s: string) => s.length)
		expect(eqLen('a', 'b')).toBe(true)
		expect(eqLen('a', 'bb')).toBe(false)
	})
	it('modulo works', () => {
		expect(modulo(5, 3)).toBe(2)
		expect(modulo(-5, 3)).toBe(1)
	})
	it('always works', () => {
		expect(always(1)()).toBe(1)
	})
	it('not works', () => {
		expect(not(true)).toBe(false)
	})
})
