import { reduce } from '.'
import { shallowEqual } from '../objects/shallowEqual'
import { maxFold, minFold, shuffle, sort } from './compare'

describe('maxFold', () => {
	test('empty', () => {
		const res = reduce(maxFold(), [])
		expect(res).toEqual(-Infinity)
	})
	test('defined', () => {
		const res = reduce(maxFold(), [0, 2, 1])
		expect(res).toEqual(2)
	})
})

describe('minFold', () => {
	test('empty', () => {
		const res = reduce(minFold(), [])
		expect(res).toEqual(+Infinity)
	})
	test('defined', () => {
		const res = reduce(minFold(), [1, 0, 2])
		expect(res).toEqual(0)
	})
})

describe('sort', () => {
	test('', () => {
		const res = reduce(sort(), [0, 2, 2, 1])
		expect(res).toEqual([0, 1, 2])
	})
})

describe('shuffle', () => {
	test('', () => {
		let res: number[]
		do {
			res = reduce(shuffle(), [0, 1, 2, 3])
		} while (shallowEqual(res, [0, 1, 2, 3]))
		expect(res).not.equal([0, 1, 2, 3])
		res.sort((a, b) => a - b)
		expect(res).toEqual([0, 1, 2, 3])
	})
})
