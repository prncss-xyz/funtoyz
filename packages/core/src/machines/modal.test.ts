import { tag, Tags } from '../foundations/tags/core'
import { Machine } from './core'
import { modalMachine } from './modal'

describe('modalMachine', () => {
	const m = modalMachine<
		{
			p: number
			q: string
			r: boolean
			s: number
		},
		{
			a: number
			b: string
			c: 'forbidden'
			final: void
		}
	>()(tag('a', 0), {
		a: {
			derive: 'A',
			events: {
				p: (e, s) => tag('a', e + s),
				q: tag('b', 'Q'),
				r: tag('c', 'forbidden'),
			},
			otherwise: tag('final'),
		},
		b: {
			events: {
				q: (e, s) => tag('b', e + s),
			},
		},
		c: () => tag('a', 5),
		final: { derive: 'E' },
	})
	const { derive, init, send } = m

	expectTypeOf(m).toExtend<Machine<any, any, any, any, any>>()

	test('init', () => {
		expect(init()).toEqual(tag('a', 0))
	})
	describe('send', () => {
		test('exclude transient states from type', () => {
			type Res = ReturnType<typeof send>
			expectTypeOf<Res>().toEqualTypeOf<
				Tags<{ a: number; b: string; final: void }>
			>()
		})
		test('base', () => {
			expect(send(tag('p', 1), tag('a', 0))).toEqual(tag('a', 1))
		})
		test('otherwise', () => {
			expect(send(tag('s', 0), tag('a', 0))).toEqual(tag('final'))
		})
		test('transient state', () => {
			expect(send(tag('r', true), tag('a', 0))).toEqual(tag('a', 5))
		})
		test('no event handler', () => {
			const res = tag('b', 'B')
			expect(send(tag('p', 3), res)).toBe(res)
		})
	})
	describe('derive', () => {
		type Res = ReturnType<typeof derive>
		test('type', () => {
			expectTypeOf<Res>().toEqualTypeOf<
				| {
						payload: 'A'
						type: 'a'
				  }
				| {
						payload: 'E'
						type: 'final'
				  }
				| {
						payload: string
						type: 'b'
				  }
			>()
		})
		test('base', () => {
			expect(derive(tag('a', 1))).toEqual(tag('a', 'A'))
		})
		test('default', () => {
			expect(derive(tag('b', 'b'))).toEqual(tag('b', 'b'))
		})
	})
})
