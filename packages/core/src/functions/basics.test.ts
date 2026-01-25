import { id, pipe2, setState } from './basics'

describe('id', () => {
	test('base', () => {
		expect(id(1)).toBe(1)
	})
})

describe('pipe2', () => {
	test('chain', () => {
		expect(
			pipe2(
				(x: number) => x + 1,
				(x) => x * 2,
			)(1),
		).toBe(4)
	})
	test('left identity', () => {
		expect(pipe2(id<number>, (x) => x * 2)(1)).toBe(2)
	})
	test('right identity', () => {
		expect(pipe2((x: number) => x * 2, id)(1)).toBe(2)
	})
})

describe('setState', () => {
	test('function', () => {
		expect(setState((x: number) => x + 1, 1)).toBe(2)
	})
	test('value', () => {
		expect(setState(2, 1)).toBe(2)
	})
})
