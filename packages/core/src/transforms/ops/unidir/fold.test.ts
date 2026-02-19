import { flow } from '../../../functions/flow'
import { view } from '../../extractors'
import { periodic } from '../../sources/async/periodic'
import { iter } from '../../sources/sync/iter'
import { fold } from './fold'
import { take } from './take'

describe('fold', () => {
	test('view, sync', async () => {
		const focus = flow(
			iter<number>(),
			take(3),
			fold({
				init: 0,
				reduce: (e, acc) => e + acc,
			}),
		)
		const res = view(focus)([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number>()
		expect(res).toEqual(6)
	})
	test('view, async', async () => {
		const focus = flow(
			periodic(),
			take(3),
			fold({
				init: 0,
				reduce: (e, acc) => e + acc,
			}),
		)
		const res = await view(focus)(1)
		expectTypeOf(res).toEqualTypeOf<number>()
	})
})
