import { reduce } from './reduce'
import { productFold, stateFold, sumFold } from './misc'
import { add } from '../functions/elementary'

describe('stateFold', () => {
	test('value', () => {
		const res = reduce(stateFold(3), [1])
		expect(res).toBe(1)
	})
	test('funtion', () => {
		const res = reduce(stateFold(3), [add(1)])
		expect(res).toBe(4)
	})
})

describe('sumFold', () => {
	test('basic', () => {
		const res = reduce(sumFold(), [2, 3, 4])
		expect(res).toBe(9)
	})
})

describe('productFold', () => {
	test('basic', () => {
		const res = reduce(productFold(), [2, 3, 4])
		expect(res).toBe(24)
	})
})
