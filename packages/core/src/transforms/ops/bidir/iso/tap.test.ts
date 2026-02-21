import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { tap } from './tap'

describe('tap', () => {
	test('calls side effect function while passing values through', () => {
		const cb = vi.fn()
		const res = collect(flow(range(1, 4), tap(cb)))()
		expect(cb.mock.calls).toEqual([[1], [2], [3]])
		expect(res).toEqual([1, 2, 3])
	})
})
