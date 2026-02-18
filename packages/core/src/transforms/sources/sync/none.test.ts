import { collect } from '../../extractors'
import { none } from './none'

describe('none', () => {
	test('basic', () => {
		const res = collect(none<number>())()
		expect(res).toEqual([])
	})
})
