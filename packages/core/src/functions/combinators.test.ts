import { negate } from './combinators'
import { eq } from './elementary'

describe('negate', () => {
	test('base', () => {
		const n = negate(eq(3))
		expect(n(3)).toBeFalsy()
	})
})
