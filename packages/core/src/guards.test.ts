import { isArray, isFunction, isNullish, isPromise, isUnknown } from './guards'

describe('guards', () => {
	it('checks types correctly', () => {
		expect(isFunction(() => {})).toBe(true)
		expect(isFunction(1)).toBe(false)

		expect(isNullish(null)).toBe(true)
		expect(isNullish(undefined)).toBe(true)
		expect(isNullish(0)).toBe(false)

		expect(isUnknown('anything')).toBe(true)

		expect(isPromise(Promise.resolve())).toBe(true)
		expect(isPromise({})).toBe(false)

		expect(isArray([])).toBe(true)
		expect(isArray({})).toBe(false)
	})
})
