import { asserted, exhaustive, forbidden, isoAssert } from './assertions'
import { isNullish } from './guards'

describe('isoAssert', () => {
	test('type', () => {
		function t(x: number | undefined) {
			isoAssert(isNullish(x))
			return x
		}
		const x = t(undefined)
		expectTypeOf(x).toEqualTypeOf<undefined>()
	})
	test('pass', () => {
		isoAssert(true)
	})
	test('fail, message', () => {
		expect(() => {
			isoAssert(false, 'message')
		}).toThrowError('message')
	})
	test('fail, default message', () => {
		expect(() => {
			isoAssert(false)
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
