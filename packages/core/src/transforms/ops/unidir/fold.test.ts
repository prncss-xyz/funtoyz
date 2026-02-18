import { flow } from '../../../functions/flow'
import { view } from '../../extractors'
import { iter } from '../../sources/sync/iter'
import { fold } from './fold'

// TODO: test async
describe('fold', () => {
	const focus = flow(
		iter<number>(),
		fold({
			init: 0,
			reduce: (e, acc) => e + acc,
		}),
	)
	test('view', () => {
		const res = view(focus)([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number>()
		expect(res).toEqual(6)
	})
})
