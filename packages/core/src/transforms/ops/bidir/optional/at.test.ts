import { flow } from '../../../../functions/flow'
import { success } from '../../../../tags/results'
import { TYPE } from '../../../../tags/types'
import { preview, REMOVE, update } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { at } from './at'

describe('at', () => {
	type S = number[]
	const o = flow(once<S>(), at(1))
	test('preview, success', () => {
		expect(preview(o)([1, 2, 3])).toEqual(success.of(2))
	})
	test('preview, failure', () => {
		expect(preview(o)([])[TYPE]).toEqual('failure')
	})

	test('put', () => {
		expect(update(o)(0)([1, 2, 3])).toEqual([1, 0, 3])
	})
	test('over', () => {
		expect(update(o)((x) => x + 1)([1, 2, 3])).toEqual([1, 3, 3])
	})
	test('remove', () => {
		expect(update(o)(REMOVE)([1, 2, 3])).toEqual([1, 3])
	})
})

describe('composed at', () => {
	type S = number[][]
	const o = flow(once<S>(), at(1), at(2))
	test('view', () => {
		const res = preview(o)([
			[1, 2, 3],
			[4, 5, 6],
		])
		expect(res).toEqual(success.of(6))
	})
	test('put', () => {
		const res = update(o)(0)([
			[1, 2, 3],
			[4, 5, 6],
		])
		expect(res).toEqual([
			[1, 2, 3],
			[4, 5, 0],
		])
	})
	test('over', () => {
		const res = update(o)((x) => x + 1)([
			[1, 2, 3],
			[4, 5, 6],
		])
		expect(res).toEqual([
			[1, 2, 3],
			[4, 5, 7],
		])
	})
	test('remove', () => {
		const res = update(o)(REMOVE)([
			[1, 2, 3],
			[4, 5, 6],
		])
		expect(res).toEqual([
			[1, 2, 3],
			[4, 5],
		])
	})
})
