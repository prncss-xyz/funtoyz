import { flow } from '../../../functions/flow'
import { update, view } from '../../extractors'
import { once } from '../../sources/sync/once'
import { map } from './map'

describe('map', () => {
	const o = flow(
		once<string>(),
		map((s) => s.length),
	)
	it('view', () => {
		expect(view(o)('toto')).toBe(4)
	})

	// @ts-expect-error must fail with a getter
	update(o)

	expect(() => {
		// @ts-expect-error must fail with a getter
		review(o)
	}).toThrow()
})
