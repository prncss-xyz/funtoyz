import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { window } from './window'

describe('window', () => {
	test('creates sliding windows of fixed size', () => {
		const res = collect(flow(range(0, 5), window(3)))()
		expect(res).toEqual([
			[0, 1, 2],
			[1, 2, 3],
			[2, 3, 4],
		])
	})
})
