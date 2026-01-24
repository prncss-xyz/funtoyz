import { lazy, thrush } from './combinators'
import { sub } from './functions/elementary'

describe('thrush', () => {
	test('base', () => {
		const t = thrush(3)
		expect(t(sub(1))).toEqual(2)
	})
})

describe('lazy', () => {
	test('executes callback lazily', () => {
		const cb = vi.fn((x: number) => x * 2)
		const l = lazy(cb)
		expect(cb).not.toHaveBeenCalled()
		expect(l(3)).toBe(6)
		expect(cb).toHaveBeenCalledWith(3)
	})
})
