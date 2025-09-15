import { hello } from './hello'

describe('hello', () => {
	test('world', () => {
		expect(hello()).toEqual({ hello: 0, world: 1 })
	})
})
