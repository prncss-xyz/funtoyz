import { flow } from '../../../functions/flow'
import { eq } from '../../core/eq'
import { collect } from '../../extractors/collect'
import { range } from '../../sources/pull/loop'
import { flatten } from './flatten'
import { map } from './map'

describe('flatten', () => {
	it('sync', () => {
		const o = flow(
			eq<number>(),
			map((i) => range(0, i)),
			flatten(),
		)
		const res = collect(o)(range(1, 4))
		expect(res).toEqual([0, 0, 1, 0, 1, 2])
	})
})
