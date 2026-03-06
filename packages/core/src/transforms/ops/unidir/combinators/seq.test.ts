import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { filter } from '../../bidir/prism/filter'
import { seq } from './seq'

describe('seq', () => {
	test('basic', () => {
		const o = flow(
			range(0, 5),
			seq(
				filter((x) => x % 2 === 0),
				filter((x) => x % 3 === 0),
			),
		)
		const res = collect(o)()
		expect(res).toEqual([0, 0, 2, 3, 4])
	})
})
