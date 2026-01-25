import { eq } from '../eq'
import { review, reviewAsync } from './review'

describe('review', () => {
	it('reviews value synchronously', () => {
		expect(review(eq<number>())(1)).toBe(1)
	})

	it('reviews value async', async () => {
		expect(await reviewAsync(eq<number>())(1)).toBe(1)
	})
})
