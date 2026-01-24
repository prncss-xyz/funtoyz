import { Exit, exit } from './core'

describe('machines/core', () => {
	it('Exit class works', () => {
		const e = new Exit(10)
		expect(e).toBeInstanceOf(Exit)
		expect(e.value).toBe(10)
	})
	it('exit helper works', () => {
		const e = exit(20)
		expect(e).toBeInstanceOf(Exit)
		expect(e.value).toBe(20)
	})
})
