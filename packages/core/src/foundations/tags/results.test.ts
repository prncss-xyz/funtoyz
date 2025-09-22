import { assertion } from '../assertions'
import { nothing, Result, result } from './results'

const { failure, success } = result

describe('of, get', () => {
	test('get inverts of', () => {
		expect(success.get(success.of(3))).toBe(3)
	})
})

describe('is', () => {
	test('success', () => {
		expect(success.is(success.of(3))).toBe(true)
	})
	test('failure', () => {
		expect(success.is(failure.of(nothing.of()))).toBe(false)
	})
	test('type guard', () => {
		function f(x: Result<number, any>) {
			assertion(success.is(x))
			expectTypeOf(x).toEqualTypeOf<ReturnType<typeof success.of<number>>>()
			return x
		}
		f(success.of(3))
	})
})
