import { flow } from '../../../functions/flow'
import { collect } from '../../extractors'
import { periodic } from '../../sources/async/periodic'
import { range } from '../../sources/sync/loop'
import { flatten } from './flatten'
import { map } from './map'
import { take } from './take'

describe('flatten, emit', () => {
	test('range', () => {
		const o = flow(
			range(1, 4),
			map((s) => range(0, s)),
			flatten(),
		)
		expect(collect(o)()).toEqual([0, 0, 1, 0, 1, 2])
	})
	test('async', async () => {
		const o = flow(
			periodic(15),
			map(() => flow(periodic(10), take(2))),
			flatten(),
			take(4),
		)
		const res = await collect(o)()
		expect(res.length).toEqual(4)
	})
})
