import { flow } from '../../../functions/flow'
import { result, Result } from '../../../tags/results'
import { eq } from '../../eq'
import { preview } from '../../extractors/preview'
import { review } from '../../extractors/review'
import { update } from '../../extractors/update'
import { view } from '../../extractors/view'
import { filter } from './filter'

function isNumber(u: unknown): u is number {
	return typeof u === 'number'
}

describe('filter', () => {
	type S = number
	const isOdd = (n: number) => n % 2 === 1
	const o = flow(eq<S>(), filter(isOdd))
	it('view, preview', () => {
		// @ts-expect-error must fail with a prism
		view(o)
		const res = preview(o)(0)
		expect(res).toEqual(result.failure.of('nothing'))
		expectTypeOf(res).toEqualTypeOf<Result<number, 'nothing'>>()
	})
	it('view, success', () => {
		expect(preview(o)(1)).toEqual(result.success.of(1))
	})
	it('put', () => {
		expect(review(o)(0)).toEqual(0)
		expect(review(o)(1)).toEqual(1)
	})
	it('over', () => {
		expect(update(o)((x) => x + 1)(0)).toBe(0)
		expect(update(o)((x) => x + 1)(1)).toBe(2)
	})
	it('should refine type', () => {
		const o = flow(eq<number | string>(), filter(isNumber))
		const res = preview(o)('')
		expectTypeOf(res).toEqualTypeOf<Result<number, 'nothing'>>()
	})
})
