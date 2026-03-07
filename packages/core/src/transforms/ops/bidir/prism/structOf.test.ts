import { flow } from '../../../../functions/flow'
import { review, view } from '../../../extractors'
import { linear } from '../iso/linear'
import { filter } from './filter'
import { num, strToNum } from './primitives'
import { arrayOf } from './structOf'

function isOdd(n: number) {
	return n % 2 === 1
}

describe('each', () => {
	test('num', () => {
		const o = flow(num, filter(isOdd), linear(2), arrayOf())
		const r1 = view(o)([1, 3])
		expect(r1).toEqual([2, 6])
		const r2 = view(o)([1, 2, 3])
		expect(r2).toEqual(undefined)
		const r3 = review(o)([2, 6])
		expect(r3).toEqual([1, 3])
	})
	test('strToNum', () => {
		const o = flow(strToNum, filter(isOdd), linear(2), arrayOf())
		const r1 = view(o)(['1', '3'])
		expect(r1).toEqual([2, 6])
		const r2 = view(o)(['1', '2', '3'])
		expect(r2).toEqual(undefined)
		const r3 = review(o)([2, 6])
		expect(r3).toEqual(['1', '3'])
	})
})
