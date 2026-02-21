import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { drop } from './drop'

describe('drop', () => {
	test('drops first n elements', () => {
		const res = collect(flow(range(0, 7), drop(4)))()
		expect(res).toEqual([4, 5, 6])
	})
})
