import { always, id, pipe2 } from './basics'

describe('id', () => {
	test('base', () => {
		expect(id(1)).toBe(1)
	})
})

describe('always', () => {
	test('base', () => {
		expect(always(1)()).toBe(1)
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
