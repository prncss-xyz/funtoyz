import { collect } from '../../extractors'
import { iter } from './iter'

describe('iter', () => {
	test('basic', () => {
		const res = collect(iter<number>())([0, 1, 2])
		expect(res).toEqual([0, 1, 2])
	})
})
