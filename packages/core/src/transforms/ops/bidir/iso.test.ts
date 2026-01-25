import { flow } from '../../../functions/flow'
import { eq } from '../../eq'
import { review } from '../../extractors/review'
import { update } from '../../extractors/update'
import { view } from '../../extractors/view'
import { iso } from './iso'

describe('iso', () => {
	type S = { a: number }
	const o = flow(eq<S>(), iso({ get: (s) => s.a, set: (a) => ({ a }) }))
	it('view', () => {
		expect(view(o)({ a: 1 })).toBe(1)
	})
	it('put', () => {
		expect(review(o)(2)).toEqual({ a: 2 })
	})
	it('over', () => {
		expect(update(o)((x) => x + 1)({ a: 1 })).toEqual({ a: 2 })
	})
})
