import { tag } from '../../tags/tag'
import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const machine = directMachine()(0, {
			finish: (e: number) => e,
			inc: (e: number, count) => count + e,
		})

		const instance = machine()
		expect(instance.init).toEqual(0)

		const s1 = instance.reduce(tag('inc', 5), 1)
		expect(s1).toEqual(6)
	})
})
