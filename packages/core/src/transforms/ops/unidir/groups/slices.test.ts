import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { slices } from './slices'

describe('slices', () => {
	test('creates non-overlapping chunks of fixed size', () => {
		const res = collect(flow(range(0, 7), slices(3)))()
		expect(res).toEqual([
			[0, 1, 2],
			[3, 4, 5],
		])
	})
})
