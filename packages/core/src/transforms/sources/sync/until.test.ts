import { add } from '../../../functions/elementary'
import { collect } from '../../extractors'
import { until } from './until'


describe('until', () => {
	test('base', () => {
		const res = collect(until(0, add(1), (x) => x === 3))()
		expect(res).toEqual([1, 2, 3])
	})
})
