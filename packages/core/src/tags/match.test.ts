import { flow } from '../functions/flow'
import { match, matcher } from './match'
import { tags } from './tags'
import { Tags } from './types'

type T = Tags<{ a: number; b: string; c: string }>
const type = tags<T>()('a', 'b', 'c')

describe('match', () => {
	const a = type.a.of(3) as T
	test('with default', () => {
		const res = match(
			a,
			{
				a: (x) => x + 1,
				b: (x) => x,
			},
			true,
		)
		expectTypeOf(res).toEqualTypeOf<boolean | number | string>()
		expect(res).toBe(4)
	})

	test('without default', () => {
		const res = match(a, {
			a: (x) => x + 1,
			b: (x) => x,
			c: (x) => x,
		})
		expect(res).toBe(4)
		expectTypeOf(res).toEqualTypeOf<number | string>()

		match(
			a,
			// @ts-expect-error should reject
			{
				a: (x) => x,
				b: (x) => x,
			},
		)
		match(
			a,
			// @ts-expect-error should reject
			{
				a: (x) => x,
				b: (x) => x,
				c: (x) => x,
			},
			3,
		)
	})
})

describe('match', () => {
	const c = type.c.of('C') as T
	test('with default', () => {
		// @ts-expect-error should reject
		flow(c, matcher({ a: (x) => x, b: (x) => x }))

		const res = flow(c, matcher({ a: (x) => x, b: (x) => x }, true))
		expectTypeOf(res).toEqualTypeOf<boolean | number | string>()
		expect(res).toBe(true)
	})
	test('without default', () => {
		const res = flow(
			c,
			matcher({ a: (x) => x, b: (x) => x, c: (x) => x + '!' }),
		)
		expectTypeOf(res).toEqualTypeOf<number | string>()
		expect(res).toBe('C!')
		// @ts-expect-error should reject
		flow(c, matcher({ a: (x) => x, b: (x) => x, c: (x) => x }, true))
	})
})
