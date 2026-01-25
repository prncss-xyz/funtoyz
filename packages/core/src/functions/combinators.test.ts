import { negate } from './combinators'
import { eeq } from './elementary'

describe('negate', () => {
	test('base', () => {
		const n = negate(eeq(3))
		expect(n(3)).toBeFalsy()
	})
})
