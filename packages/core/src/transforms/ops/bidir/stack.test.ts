import { flow } from '../../../functions/flow'
import { nothing, result } from '../../../tags/results'
import { eq } from '../../eq'
import { preview } from '../../extractors/preview'
import { REMOVE, update } from '../../extractors/update'
import { stack } from './stack'

describe('foot', () => {
	type Source = string[]
	const sourceDefined: Source = ['a', 'b', 'c']
	const sourceUndefined: Source = []
	const o = flow(eq<string[]>(), stack())
	describe('view', () => {
		it('defined', () => {
			expect(preview(o)(sourceDefined)).toEqual(result.success.of('c'))
		})
		it('undefined', () => {
			expect(preview(o)(sourceUndefined)).toEqual(result.failure.of(nothing()))
		})
	})
	describe('put', () => {
		it('defined', () => {
			expect(update(o)('A')(sourceDefined)).toEqual(['a', 'b', 'c', 'A'])
		})
		it('undefined', () => {
			expect(update(o)('A')(sourceUndefined)).toEqual(['A'])
		})
	})
	describe('remove', () => {
		it('defined', () => {
			expect(update(o)(REMOVE)(sourceDefined)).toEqual(['a', 'b'])
		})
		it('undefined', () => {
			expect(update(o)(REMOVE)(sourceUndefined)).toEqual(sourceUndefined)
		})
	})
})
