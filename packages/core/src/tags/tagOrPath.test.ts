import { PathFromTag, tagOrPath } from './tagOrPath'

describe('tagOrPath', () => {
	test('one', () => {
		type Q = PathFromTag<{ payload?: undefined; type: 'a' }>
		expectTypeOf<Q>().toEqualTypeOf<['a', undefined] | ['a']>()
	})
	test('two', () => {
		type Q = PathFromTag<{ payload: string; type: 'a' }>
		expectTypeOf<Q>().toEqualTypeOf<['a', string]>()
	})
	test('two, optional', () => {
		type Q = PathFromTag<{ payload?: string; type: 'a' }>
		expectTypeOf<Q>().toEqualTypeOf<['a', string] | ['a']>()
	})
	test('three', () => {
		type Q = PathFromTag<{
			payload: { payload: { x: number }; type: 'b' }
			type: 'a'
		}>
		expectTypeOf<Q>().toEqualTypeOf<['a', 'b', { x: number }]>()
	})
	test('tagOrPath', () => {
		const t1 = tagOrPath({ type: 'a' }) satisfies { type: 'a' }
		expect(t1).toEqual({ type: 'a' })

		const t2 = tagOrPath<{ payload?: string; type: 'a' }>('a') satisfies {
			type: 'a'
		}
		expect(t2).toEqual({ type: 'a' })

		const t3 = tagOrPath('a', 'b') satisfies { payload: 'b'; type: 'a' }
		expect(t3).toEqual({ payload: 'b', type: 'a' })
	})
})
