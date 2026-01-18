import { tag } from './tag'

describe('tag', () => {
	test('one argument', () => {
		const t1 = tag('a') satisfies { type: 'a' }
		expect(t1).toEqual({ type: 'a' })
	})
	test('two arguments', () => {
		const t2 = tag('a', 'b') satisfies { payload: 'b'; type: 'a' }
		expect(t2).toEqual({ payload: 'b', type: 'a' })
	})
	test('three arguments', () => {
		const t3 = tag('a', 'b', 'c') satisfies {
			payload: { payload: 'c'; type: 'b' }
			type: 'a'
		}
		expect(t3).toEqual({
			payload: { payload: 'c', type: 'b' },
			type: 'a',
		})
	})
})
