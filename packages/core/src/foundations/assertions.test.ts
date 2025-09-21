import {
	asserted,
	assertion,
	exhaustive,
	forbidden,
	successful,
} from './assertions'
import { isNonNullish, isNullish } from './guards'
import { nothing, Nothing, result, Result } from './results'

describe('assertion', () => {
	function t(x: number | undefined) {
		assertion(isNonNullish(x), 'message')
		expectTypeOf(x).toEqualTypeOf<number>()
	}
	test('pass', () => {
		t(3)
	})
	test('fail, message', () => {
		expect(() => {
			t(undefined)
		}).toThrowError('message')
	})
	test('fail, default message', () => {
		expect(() => {
			assertion(false)
		}).toThrowError()
	})
})

describe('asserted', () => {
	test('pass', () => {
		const v: number | undefined = 3
		const res = asserted(isNonNullish)(v)
		expectTypeOf(res).toEqualTypeOf<number>()
		const r2 = asserted(isNonNullish, 'message')
		expect(() => r2(undefined)).toThrow('message')
	})
	test('fail', () => {
		function f(x: number | undefined) {
			const res = asserted(isNullish)(x)
			expectTypeOf(res).toEqualTypeOf<undefined>()
		}
		expect(() => {
			f(3)
		}).toThrowError()
	})
})

describe('successful', () => {
	function t(x: Result<number, Nothing>) {
		const res = successful(x)
		expectTypeOf(res).toEqualTypeOf<number>()
		return res
	}
	test('pass', () => {
		expect(t(result.success.of(3))).toBe(3)
	})
	test('fail', () => {
		expect(() => {
			t(result.failure.of(nothing.of()))
		}).toThrowError()
	})
	test('message', () => {
		expect(() => {
			successful(result.failure.of(nothing.of()), 'message')
		}).toThrowError('message')
	})
	test('curried', () => {
		expect(() => {
			successful('message')(result.failure.of(nothing.of()))
		}).toThrowError('message')
	})
})

describe('exhaustive', () => {
	test('fail', () => {
		expect(() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			exhaustive(3)
		}).toThrowError()
	})
})

describe('forbidden', () => {
	test('fail', () => {
		expect(() => {
			forbidden()
		}).toThrowError()
	})
})
