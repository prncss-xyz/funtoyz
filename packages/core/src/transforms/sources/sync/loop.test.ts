import { add, lt } from '../../../functions/elementary'
import { flow } from '../../../functions/flow'
import { collect } from '../../extractors'
import { take } from '../../ops/unidir/take'
import { loop, range, times } from './loop'

describe('loop', () => {
	test('basin', () => {
		const res = collect(loop(0, lt(3), add(1)))()
		expect(res).toEqual([0, 1, 2])
	})
})

describe('range', () => {
	test('ascending', () => {
		const res = collect(range(0, 3))()
		expect(res).toEqual([0, 1, 2])
	})
	test('descending', () => {
		const res = collect(range(2, -1, -1))()
		expect(res).toEqual([2, 1, 0])
	})
})

describe('times', () => {
	test('basic', () => {
		const res = collect(times(3))()
		expect(res).toEqual([0, 1, 2])
	})
	test('infinity', () => {
		const res = collect(flow(times(), take(3)))()
		expect(res).toEqual([0, 1, 2])
	})
})
