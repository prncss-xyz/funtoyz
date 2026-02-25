import { isoAssert } from '../assertions'
import {
	failure,
	Nothing,
	nothing,
	Result,
	success,
	successful,
} from './results'

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
		expect(success.is(nothing())).toBe(false)
	})
	test('type guard', () => {
		function f(x: Result<number, any>) {
			isoAssert(success.is(x))
			expectTypeOf(x).toEqualTypeOf<ReturnType<typeof success.of<number>>>()
			return x
		}
		f(success.of(3))
	})
})

describe('successful', () => {
	function t(x: Result<number, Nothing>) {
		const res = successful(x)
		expectTypeOf(res).toEqualTypeOf<number>()
		return res
	}
	test('pass', () => {
		expect(t(success.of(3))).toBe(3)
	})
	test('fail', () => {
		expect(() => {
			t(failure.of(nothing()))
		}).toThrowError()
	})
	test('message', () => {
		expect(() => {
			successful(failure.of(nothing()), 'message')
		}).toThrowError('message')
	})
	test('curried', () => {
		expect(() => {
			successful('message')(failure.of(nothing()))
		}).toThrowError('message')
	})
})
