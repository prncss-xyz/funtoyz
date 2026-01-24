import {
	insert,
	insertCmp,
	insertSorted,
	remove,
	replace,
	symmetricDiff,
} from './arrays'

describe('insertSorted', () => {
	it('inserts sorted', () => {
		expect(insertSorted(2)([1, 3])).toEqual([1, 2, 3])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 3]
		expect(insertSorted(3)(xs)).toBe(xs)
	})
})

describe('symmetricDiff', () => {
	it('returns symmetric difference', () => {
		expect(symmetricDiff([1, 2], [2, 3])).toEqual([[1], [3]])
	})
})

describe('insertCmp', () => {
	it('inserts an element', () => {
		expect(insertCmp()(0)([1, 3])).toEqual([0, 1, 3])
		expect(insertCmp()(2)([1, 3])).toEqual([1, 2, 3])
		expect(insertCmp()(4)([1, 3])).toEqual([1, 3, 4])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 3]
		expect(insertCmp()(3)(xs)).toBe(xs)
	})
})

describe('insert', () => {
	it('inserts an element', () => {
		expect(insert(0, 3)([0, 1, 2])).toEqual([3, 0, 1, 2])
		expect(insert(1, 3)([0, 1, 2])).toEqual([0, 3, 1, 2])
		expect(insert(2, 3)([0, 1, 2])).toEqual([0, 1, 3, 2])
		expect(insert(3, 3)([0, 1, 2])).toEqual([0, 1, 2, 3])
		expect(insert(-1, 3)([0, 1, 2])).toEqual([0, 1, 3, 2])
		expect(insert(3, 3)([0, 1, 2])).toEqual([0, 1, 2, 3])
		expect(insert(4, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(insert(-4, 3)([0, 1, 2])).toEqual([0, 1, 2])
	})
})

describe('replace', () => {
	it('replace an element', () => {
		expect(replace(3, 0)([0, 1, 2])).toEqual([3, 1, 2])
		expect(replace(3, 1)([0, 1, 2])).toEqual([0, 3, 2])
		expect(replace(3, 2)([0, 1, 2])).toEqual([0, 1, 3])
		expect(replace(3, -1)([0, 1, 2])).toEqual([0, 1, 3])
		expect(replace(3, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(replace(-4, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(replace(3, -5)([0, 1, 2])).toEqual([0, 1, 2])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 1, 2]
		expect(replace(0, 0)(xs)).toBe(xs)
	})
})

describe('remove', () => {
	it('remove an element', () => {
		expect(remove(0)([0, 1, 2])).toEqual([1, 2])
		expect(remove(1)([0, 1, 2])).toEqual([0, 2])
		expect(remove(2)([0, 1, 2])).toEqual([0, 1])
		expect(remove(-1)([0, 1, 2])).toEqual([0, 1])
		expect(remove(3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(remove(-4)([0, 1, 2])).toEqual([0, 1, 2])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 1, 2]
		expect(remove(4)(xs)).toBe(xs)
	})
})
