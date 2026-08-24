import { fromInit } from '../../functions/arguments/init'
import { tag } from '../../tags/tag'
import { dispatchMachine } from '../dispatch'
import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const m = directMachine()(
			{
				count: 0,
				toto: 3,
			},
			{
				finish: (_: void, count) => count,
				inc: (e: number, { count }) => ({ count: count + e }),
			},
		)

		expect(fromInit(m.init)).toEqual({ count: 0, toto: 3 })

		const s1 = dispatchMachine(
			m,
			tag('inc', 5),
			{
				count: 1,
				toto: 3,
			},
			vi.fn(),
		)
		expect(s1).toEqual({ count: 6, toto: 3 })

		// finish accepts a void payload
		dispatchMachine(m, tag('finish'), s1, vi.fn())
		// @ts-expect-error inc does not accept a void payload
		dispatchMachine(m, tag('inc'), s1, vi.fn())
	})
})
