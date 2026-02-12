import { iso } from '.'
import { flow } from '../../../../functions/flow'
import { review, view } from '../../../extractors'
import { once } from '../../../sources/sync/once'

describe('iso', () => {
	type S = { a: number }
	const o = flow(once<S>(), iso({ get: (s) => s.a, set: (a) => ({ a }) }))
	it('view', () => {
		expect(view(o)({ a: 1 })).toBe(1)
	})
	it('put', () => {
		expect(review(o)(2)).toEqual({ a: 2 })
	})
	it('over', () => {
		// expect(update(o)((x) => x + 1)({ a: 1 })).toEqual({ a: 2 })
	})
})
