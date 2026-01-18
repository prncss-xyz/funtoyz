import { asserted, assertion, exhaustive, forbidden } from './assertions'
import { isNullish } from './guards'

describe('assertion', () => {
	test('type', () => {
		function t(x: number | undefined) {
			assertion(isNullish(x))
			return x
		}
		const x = t(undefined)
		expectTypeOf(x).toEqualTypeOf<undefined>()
	})
	test('pass', () => {
		assertion(true)
	})
	test('fail, message', () => {
		expect(() => {
			assertion(false, 'message')
		}).toThrowError('message')
	})
	test('fail, default message', () => {
		expect(() => {
			assertion(false)
		}).toThrowError()
	})
})

describe('asserted', () => {
	test('type', () => {
		function t(x: number | undefined) {
			return asserted(isNullish)(x)
		}
		const x = t(undefined)
		expectTypeOf(x).toEqualTypeOf<undefined>()
	})
	test('pass', () => {
		asserted(() => true)(undefined)
	})
	test('fail', () => {
		expect(() => {
			asserted(() => false)(undefined)
		}).toThrowError()
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
