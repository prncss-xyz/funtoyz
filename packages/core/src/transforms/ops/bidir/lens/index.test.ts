import { flow } from '../../../../functions/flow'
import { update, view } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { rewrite } from '../iso/rewrite'
import { includes } from './includes'

describe('includes', () => {
	const sourceDefined = ['a', 'b', 'c']
	const sourceUndefined = ['a', 'c']
	const o = flow(
		once<string[]>(),
		rewrite((x) => x.sort()),
		includes('b'),
	)
	describe('view', () => {
		it('defined', () => {
			expect(view(o)(sourceDefined)).toBeTruthy()
		})
		it('undefined', () => {
			expect(view(o)(sourceUndefined)).toBeFalsy()
		})
	})
	describe('put', () => {
		it('defined, true', () => {
			expect(update(o)(true, sourceDefined)).toEqual(['a', 'b', 'c'])
		})
		it('defined, false', () => {
			expect(update(o)(false, sourceDefined)).toEqual(['a', 'c'])
		})
		it('undefined, true', () => {
			expect(update(o)(true, sourceUndefined)).toEqual(['a', 'b', 'c'])
		})
		it('undefined, false', () => {
			expect(update(o)(false, sourceUndefined)).toEqual(['a', 'c'])
		})
	})
})
