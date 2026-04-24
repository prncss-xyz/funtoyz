import { flow } from '../../../../functions/flow'
import { update, view } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { findOne } from './findOne'

describe('findOne', () => {
	type Source = { bar: string }
	const sourceDefined: Source[] = [
		{ bar: 'baz' },
		{ bar: 'quux' },
		{ bar: 'foo' },
	]
	const sourceUndefined: Source[] = [
		{ bar: 'baz' },
		{ bar: 'nomatch' },
		{ bar: 'foo' },
	]
	const o = flow(
		once<Source[]>(),
		findOne((item) => item.bar === 'quux'),
	)
	describe('view', () => {
		it('defined', () => {
			expect(view(o)(sourceDefined)).toEqual({ bar: 'quux' })
		})
		it('undefined', () => {
			expect(view(o)(sourceUndefined)).toBeUndefined()
		})
	})
	describe('put', () => {
		it('defined', () => {
			expect(update(o)({ bar: 'UPDATED' })(sourceDefined)).toEqual([
				{ bar: 'baz' },
				{ bar: 'UPDATED' },
				{ bar: 'foo' },
			])
		})
		it('undefined', () => {
			expect(update(o)({ bar: 'UPDATED' })(sourceUndefined)).toEqual([
				{ bar: 'baz' },
				{ bar: 'nomatch' },
				{ bar: 'foo' },
				{ bar: 'UPDATED' },
			])
		})
	})
	describe('modify', () => {
		it('defined', () => {
			expect(
				update(o)((x) => ({ bar: `${x.bar} UPDATED` }))(sourceDefined),
			).toEqual([{ bar: 'baz' }, { bar: 'quux UPDATED' }, { bar: 'foo' }])
		})
		it('undefined', () => {
			expect(
				update(o)((x) => ({ bar: `${x.bar} UPDATED` }))(sourceUndefined),
			).toEqual(sourceUndefined)
		})
	})
	describe('remove', () => {
		it('defined', () => {
			expect(update(o)(undefined)(sourceDefined)).toEqual([
				{ bar: 'baz' },
				{ bar: 'foo' },
			])
		})
		it('undefined', () => {
			expect(update(o)(undefined)(sourceUndefined)).toEqual(sourceUndefined)
		})
	})
	test('refine type', () => {
		type T = number | string
		const o = flow(
			once<T[]>(),
			findOne((item) => typeof item === 'string'),
		)
		const source: T[] = []
		const res = view(o)(source)
		expectTypeOf(res).toEqualTypeOf<string | undefined>()
	})
})
