import { flow } from '../../../../functions/flow'
import { collect, view } from '../../../extractors'
import { periodic } from '../../../sources/async/periodic'
import { iter } from '../../../sources/sync/iter'
import { take } from '../take-like/take'
import { scan } from './scan'

describe('scan', () => {
	const focus = flow(
		iter<number>(),
		scan({
			init: 0,
			reduce: (e, acc) => e + acc,
		}),
	)
	const focusAsync = flow(
		periodic(1),
		take(3),
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
	test('collect, async', async () => {
		const res = await collect(focusAsync)()
		expectTypeOf(res).toEqualTypeOf<number[]>()
		expect(res.length).toEqual(4)
	})
	test('preview', () => {
		const res = view(focus)([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number>()
		expect(res).toEqual(0)
	})
})
