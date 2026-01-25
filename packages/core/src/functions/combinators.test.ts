import { negate } from './combinators'
import { equals } from './elementary'

describe('negate', () => {
	test('base', () => {
		const n = negate(equals(3))
		expect(n(3)).toBeFalsy()
	})
})
