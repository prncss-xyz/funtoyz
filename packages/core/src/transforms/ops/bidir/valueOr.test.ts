import { expect } from 'vitest'

import { flow } from '../../../functions/flow'
import { collect, view } from '../../extractors'
import { once } from '../../sources/sync/once'
import { at } from './optional/at'
import { elems } from './traversal/elems'
import { valueOr } from './valueOr'

describe('valueOr', () => {
	describe('getter', () => {
		const o = flow(once<number[]>(), at(1), valueOr(20))
		test('view, success', () => {
			expect(view(o)([1, 2, 3])).toBe(2)
		})
		test('view, failure', () => {
			expect(view(o)([])).toBe(20)
		})
	})
	describe('emitter', () => {
		const o = flow(once<number[]>(), elems(), valueOr(20))
		test('collect, success', () => {
			expect(collect(o)([1, 2, 3])).toEqual([1, 2, 3])
		})
		test('collect, failure', () => {
			expect(collect(o)([])).toEqual([20])
		})
	})
})
