import { thrush } from './combinators'
import { sub } from './functions/elementary'

describe('thrush', () => {
	test('base', () => {
		const t = thrush(3)
		expect(t(sub(1))).toEqual(2)
	})
})
