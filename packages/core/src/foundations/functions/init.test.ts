import { id } from './basics'
import { fromInit } from './init'

describe('fromInit', () => {
	test('value', () => {
		expect(fromInit(1, 2)).toBe(1)
	})
	test('function', () => {
		expect(fromInit(id, 2)).toBe(2)
	})
})
