import { createTag } from './createTag'
import { Tags } from './types'

const a = createTag('a')
const b = createTag('b')

describe('createTags', () => {
	test('desc, void', () => {
		const n = a.of()
		expectTypeOf(n).toEqualTypeOf<{ payload: void; type: 'a' }>()
		expect(n).toEqual({ payload: undefined, type: 'a' })
	})
	test('get, is, of', () => {
		const value = { payload: 42, type: 'a' as const }
		function f(v: Tags<{ a: number; b: string }>) {
			if (a.is(v)) {
				return a.get(v)
			}
			return undefined
		}
		const x = f(value)
		expectTypeOf(x).toEqualTypeOf<number | undefined>()
		expect(x).toBe(42)
		const u = a.of(3)
		expect(u).toEqual({ payload: 3, type: 'a' })
	})
	test('map', () => {
		const value = { payload: 'toto', type: 'a' } as const
		function f(v: Tags<{ a: string; b: string }>) {
			return a.map(v, (x) => x.length)
		}
		const x = f(value)
		expectTypeOf(x).toEqualTypeOf<Tags<{ a: number; b: string }>>()
		expect(x).toEqual({ payload: 4, type: 'a' })
		expect(f({ payload: 'x', type: 'b' })).toEqual({ payload: 'x', type: 'b' })
	})
	test('chain', () => {
		const value = { payload: 'toto', type: 'a' } as const
		function f(v: Tags<{ a: string; c: boolean }>) {
			return a.chain(v, (x) => b.of(x.length))
		}
		const x = f(value)
		expectTypeOf(x).toEqualTypeOf<Tags<{ b: number; c: boolean }>>()
		expect(x).toEqual({ payload: 4, type: 'b' })
		expect(f({ payload: false, type: 'c' })).toEqual({
			payload: false,
			type: 'c',
		})
	})
})
