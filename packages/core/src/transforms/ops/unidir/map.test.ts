import { flow } from '../../../functions/flow'
import { collect, update, view } from '../../extractors'
import { iter } from '../../sources/sync/iter'
import { once } from '../../sources/sync/once'
import { map } from './map'

describe('map, single', () => {
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

describe('map, multiple', () => {
	const o = flow(
		iter<string>(),
		map((s) => s.length),
	)
	it('view', () => {
		expect(collect(o)(['toto', 'to'])).toEqual([4, 2])
	})

	// @ts-expect-error must fail with a getter
	update(o)

	expect(() => {
		// @ts-expect-error must fail with a getter
		review(o)
	}).toThrow()
})
