import { flow } from '../../../functions/flow'
import { collect } from '../../extractors'
import { once } from '../../sources/sync/once'
import { elems } from '../bidir/traversal/elems'
import { take } from './take'

describe('take', () => {
	test('2', () => {
		const o = flow(once<number[]>(), elems(), take(20))
		expect(collect(o)([0, 1, 2, 3])).toEqual([0, 1])
		// it should be idempotent
		expect(collect(o)([0, 1, 2, 3])).toEqual([0, 1])
	})
	test('0', () => {
		const o = flow(once<number[]>(), elems(), take(30))
		expect(collect(o)([0, 1, 2, 3])).toEqual([])
	})
})
