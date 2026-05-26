import { reduce } from '../../../../reducers/reduce'
import { fromEntries } from './entries'

describe('fromEntries', () => {
	test('basic', () => {
		const res = reduce(fromEntries(), [
			['a', 0],
			['b', 1],
			['c', 2],
		])
		expect(res).toEqual({
			a: 0,
			b: 1,
			c: 2,
		})
	})
})
