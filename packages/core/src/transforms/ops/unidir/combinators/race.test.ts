import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { filter } from '../../bidir/prism/filter'
import { elems } from '../../bidir/traversal/elems'
import { race } from './race'

describe('race', () => {
	test('basic', () => {
		const o = flow(
			once<number[]>(),
			elems(),
			race(
				filter((x) => x % 2 === 0),
				filter((x) => x % 3 === 0),
			),
		)
		const res = collect(o)([0, 1, 2, 3, 4])
		expect(res).toEqual([0, 0, 2, 3, 4])
	})
})
