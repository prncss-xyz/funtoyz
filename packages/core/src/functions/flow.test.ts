import { flow } from './flow'

const plus1 = (v: number): number => v + 1
const times2 = (v: number): number => v * 2

describe('flow', () => {
	test('0', () => {
		const res = flow(0)
		expect(res).toBe(0)
	})
	test('1', () => {
		const res = flow(0, plus1)
		expect(res).toBe(1)
	})
	test('2', () => {
		const res = flow(0, plus1, plus1)
		expect(res).toBe(2)
	})
	test('3', () => {
		const res = flow(0, plus1, plus1, plus1)
		expect(res).toBe(3)
	})
	test('4', () => {
		const res = flow(0, plus1, plus1, plus1, plus1)
		expect(res).toBe(4)
	})
	test('5', () => {
		const res = flow(0, plus1, plus1, plus1, plus1, plus1)
		expect(res).toBe(5)
	})
	test('6', () => {
		const res = flow(0, plus1, plus1, plus1, plus1, plus1, plus1)
		expect(res).toBe(6)
	})
	test('7', () => {
		const res = flow(0, plus1, plus1, plus1, plus1, plus1, plus1, plus1)
		expect(res).toBe(7)
	})
	test('8', () => {
		const res = flow(0, plus1, plus1, plus1, plus1, plus1, plus1, plus1, plus1)
		expect(res).toBe(8)
	})
	test('9', () => {
		const res = flow(
			0,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
		)
		expect(res).toBe(9)
	})
	test('10', () => {
		const res = flow(
			0,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			plus1,
			times2,
		)
		expect(res).toEqual(18)
	})
})
