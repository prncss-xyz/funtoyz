import {
	always,
	clamp,
	eqWith,
	maxFrom,
	maxWith,
	minFrom,
	minWith,
	modulo,
	not,
	tuple,
} from './elementary'

describe('clamp', () => {
	it('works', () => {
		expect(clamp(0, 10, -5)).toBe(0)
		expect(clamp(0, 10, 5)).toBe(5)
		expect(clamp(0, 10, 15)).toBe(10)
		expect(clamp(2, 0, 15)).toBe(2)
	})
})
describe('tuple', () => {
	it('works', () => {
		expect(tuple(1, 'a')).toEqual([1, 'a'])
	})
})
describe('eqWith', () => {
	it('works', () => {
		const eqLen = eqWith((s: string) => s.length)
		expect(eqLen('a', 'b')).toBe(true)
		expect(eqLen('a', 'bb')).toBe(false)
	})
})
describe('modulo', () => {
	it('works', () => {
		expect(modulo(5, 3)).toBe(2)
		expect(modulo(-5, 3)).toBe(1)
	})
})
describe('always', () => {
	it('works', () => {
		expect(always(1)()).toBe(1)
	})
})
describe('not', () => {
	it('works', () => {
		expect(not(true)).toBe(false)
	})
})

describe('maxFrom', () => {
	it('works', () => {
		const maxLen = maxFrom((s: string) => s.length)
		expect(maxLen('a', 'bb')).toBe('bb')
		expect(maxLen('aaa', 'bb')).toBe('aaa')
	})
})
describe('minFrom', () => {
	it('works', () => {
		const minLen = minFrom((s: string) => s.length)
		expect(minLen('a', 'bb')).toBe('a')
		expect(minLen('aaa', 'bb')).toBe('bb')
	})
})
describe('maxWith', () => {
	it('works', () => {
		const maxLen = maxWith((a: string, b: string) => a.length - b.length)
		expect(maxLen('a', 'bb')).toBe('bb')
		expect(maxLen('aaa', 'bb')).toBe('aaa')
	})
})
describe('minWith', () => {
	it('works', () => {
		const minLen = minWith((a: string, b: string) => a.length - b.length)
		expect(minLen('a', 'bb')).toBe('a')
		expect(minLen('aaa', 'bb')).toBe('bb')
	})
})
