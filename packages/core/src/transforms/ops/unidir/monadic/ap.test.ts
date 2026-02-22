import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { ap } from './ap'

describe('ap', () => {
	test('applies multiple functions to each value', () => {
		const res = collect(
			flow(
				range(0, 3),
				ap(
					(x) => x - 1,
					(x) => x + 1,
				),
			),
		)()
		expect(res).toEqual([-1, 1, 0, 2, 1, 3])
	})
})
