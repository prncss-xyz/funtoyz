import { eq } from '../core/eq'
import { once } from '../core/once'
import { view, viewAsync } from './view'

describe('view', () => {
	it('views value synchronously', () => {
		expect(view(eq<number>())(1)).toBe(1)
	})

	it('views value from source synchronously', () => {
		expect(view(eq<number>())(once(1))).toBe(1)
	})

	it('views value async', async () => {
		expect(await viewAsync(eq<number>())(1)).toBe(1)
	})

	it('views value from source async', async () => {
		expect(await viewAsync(eq<number>())(once(1))).toBe(1)
	})
})
