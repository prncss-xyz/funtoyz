import { flow } from '../../../functions/flow'
import { collect, view } from '../../extractors'
import { iter } from '../../sources/sync/iter'
import { scan } from './scan'

describe('scan', () => {
	const focus = flow(
		iter<number>(),
		scan({
			init: 0,
			reduce: (e, acc) => e + acc,
		}),
	)
	test('collect', () => {
		const res = collect(focus)([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number[]>()
		expect(res).toEqual([0, 1, 3, 6])
	})
	test('preview', () => {
		const res = view(focus)([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number>()
		expect(res).toEqual(0)
	})
})
