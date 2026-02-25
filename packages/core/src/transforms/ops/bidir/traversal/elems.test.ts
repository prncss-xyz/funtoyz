import { flow } from '../../../../functions/flow'
import { success } from '../../../../tags/results'
import { preview, REMOVE, update, view } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { fold } from '../../unidir/folding/fold'
import { lens } from '../lens'
import { filter } from '../prism/filter'
import { elems } from './elems'

describe('elems', () => {
	const o = flow(once<number[]>(), elems())
	test('view', () => {
		expect(preview(o)([1, 2, 3])).toEqual(success.of(1))
	})
	test('modify', () => {
		expect(update(o)((x) => x * 2)([1, 2, 3])).toEqual([2, 4, 6])
	})
	test('remove', () => {
		expect(update(o)(REMOVE)([1, 2, 3])).toEqual([])
	})
})

describe('compose with prism', () => {
	const o = flow(
		once<number[]>(),
		elems(),
		filter((x) => x % 2 === 0),
	)
	test('modify', () => {
		expect(update(o)((x) => x * 2)([1, 2, 3])).toEqual([1, 4, 3])
	})
	test('remove', () => {
		expect(update(o)(REMOVE)([1, 2, 3])).toEqual([1, 3])
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
	test('modify', () => {
		const res = update(o)((x) => x * 2)([{ a: 1 }, { a: 3 }])
		expect(res).toEqual([{ a: 2 }, { a: 6 }])
	})
	// this is to make sure the call stack doesn't grow with data length
	// since it's very long we don't run it on a regular basis
	test.skip('modify, long array', { timeout: 20_000 }, () => {
		const xs: { a: number }[] = Array(50_000).fill({ a: 1 })
		expect(update(o)((x) => x * 2)(xs)[0]).toEqual({ a: 2 })
	})
})

describe('compose with elems', () => {
	const o = flow(once<number[][]>(), elems(), elems())
	test('modify', () => {
		expect(
			update(o)((x) => x * 2)([
				[1, 2],
				[3, 4],
			]),
		).toEqual([
			[2, 4],
			[6, 8],
		])
	})
})

describe('fold', () => {
	const o = flow(
		once<number[]>(),
		elems(),
		filter((x) => x % 2 === 0),
		fold({ init: 100, reduce: (x, y) => x + y }),
	)
	test('view', () => {
		expect(view(o)([1, 2, 3])).toEqual(102)
	})
})
