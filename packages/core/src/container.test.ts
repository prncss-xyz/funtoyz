import { createContainer, Dependencies, dependency } from './container'
import { pipe } from './functions/pipe'

type A = Dependencies<{ a: number }>

describe('container', () => {
	const parent = createContainer(
		pipe(
			dependency('b', ({ a }: { a: number }) => a * 2),
			dependency('a', () => 1) satisfies A,
		),
	)
	const c = createContainer(
		pipe(
			dependency('c', ({ a, b }: { a: 1; b: number }) => a + b),
			dependency('d', () => Math.random()),
			dependency('$d', () => Math.random()),
		),
		parent,
	)
	test('base', () => {
		expect(c.a).toBe(1)
		expect(c.b).toBe(2)
		expect(c.c).toBe(3)
	})
	it('should keep reference stable', () => {
		expect(c.d).toBe(c.d)
	})
	it('should not keep reference stable', () => {
		expect(c.$d).not.toBe(c.$d)
	})
})
