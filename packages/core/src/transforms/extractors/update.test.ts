import { eq } from '../core/eq'
import { update, updateAsync } from './update'

describe('update', () => {
	it('updates value with function synchronously', () => {
		expect(update(eq<number>())((x) => x + 1)(1)).toBe(2)
	})

	it('updates value with constant synchronously', () => {
		expect(update(eq<number>())(2)(1)).toBe(2)
	})

	it('updates value with async function', async () => {
		expect(
			await (updateAsync(eq<number>()) as any)((x: number) =>
				Promise.resolve(x + 1),
			)(1),
		).toBe(2)
	})
})
