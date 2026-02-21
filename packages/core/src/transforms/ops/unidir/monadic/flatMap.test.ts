import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { periodic } from '../../../sources/async/periodic'
import { range } from '../../../sources/sync/loop'
import { take } from '../take-like/take'
import { flatMap } from './flatMap'

describe('flatMap', () => {
	test('range', () => {
		const o = flow(
			range(1, 4),
			flatMap((s) => range(0, s)),
		)
		expect(collect(o)()).toEqual([0, 0, 1, 0, 1, 2])
	})
	test('async', async () => {
		const o = flow(
			periodic(15),
			flatMap(() => flow(periodic(10), take(2))),
			take(4),
		)
		const res = await collect(o)()
		expect(res.length).toEqual(4)
	})
})
