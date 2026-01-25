import { isEmpty } from './empty'

describe('isEmpty', () => {
	test('should return true for undefined', () => {
		expect(isEmpty(undefined)).toBeTruthy()
	})

	test('should return true for null', () => {
		// @ts-expect-error Testing null at runtime
		expect(isEmpty(null)).toBeTruthy()
	})

	test('should return true for empty object', () => {
		expect(isEmpty({})).toBeTruthy()
	})

	test('should return false for object with keys', () => {
		expect(isEmpty({ a: 1 })).toBeFalsy()
	})
})
