import { reduce } from '.'
import { productFold, sumFold } from './misc'

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
