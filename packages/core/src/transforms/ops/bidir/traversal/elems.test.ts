import { flow } from '../../../../functions/flow'
import { result } from '../../../../tags/results'
import { over, preview, REMOVE, update } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { lens } from '../lens'
import { filter } from '../prism/filter'
import { elems } from './elems'

describe('elems', () => {
	const o = flow(once<number[]>(), elems())
	it('view', () => {
		expect(preview(o)([1, 2, 3])).toEqual(result.success.of(1))
	})
	it('modify', () => {
		expect(update(o)((x) => x * 2, [1, 2, 3])).toEqual([2, 4, 6])
	})
	it('remove', () => {
		expect(update(o)(REMOVE, [1, 2, 3])).toEqual([])
	})
})
describe('compose with prism', () => {
	const o = flow(
		once<number[]>(),
		elems(),
		filter((x) => x % 2 === 0),
	)
	it('modify', () => {
		expect(over(o)((x) => x * 2, [1, 2, 3])).toEqual([1, 4, 3])
	})
	it('remove', () => {
		expect(update(o)(REMOVE, [1, 2, 3])).toEqual([1, 3])
	})
})
describe('compose with lens', () => {
	function prop<S, K extends keyof S>(k: K) {
		return lens<S[K], S>({
			get: (s) => s[k],
			set: (v, s) => ({ ...s, [k]: v }),
		})
	}
	const o = flow(once<{ a: number }[]>(), elems(), prop('a'))
	it('modify', () => {
		const res = update(o)((x) => x * 2, [{ a: 1 }, { a: 3 }])
		expect(res).toEqual([{ a: 2 }, { a: 6 }])
	})
	// this is to make sure the call stack doesn't grow with data length
	it.skip('modify, long array', { timeout: 20_000 }, () => {
		const xs: { a: number }[] = Array(50_000).fill({ a: 1 })
		expect(update(o)((x) => x * 2, xs)[0]).toEqual({ a: 2 })
	})
})
describe('compose with elems', () => {
	const o = flow(once<number[][]>(), elems(), elems())
	it('modify', () => {
		expect(
			update(o)(
				(x) => x * 2,
				[
					[1, 2],
					[3, 4],
				],
			),
		).toEqual([
			[2, 4],
			[6, 8],
		])
	})
})
/*
describe('fold', () => {
	const o = flow(
		once<number[]>(),
		elems(),
		filter((x) => x % 2 === 0),
		fold({ init: 100, reduce: (x, y) => x + y }),
	)
	it('view', () => {
		// @ts-expect-error TODO:
		expect(view(o)([1, 2, 3])).toEqual(102)
	})
  })
*/
