import { hello } from './hello'

describe('hello', () => {
	test('world', () => {
		expect(hello()).toBe('world')
	})
})
