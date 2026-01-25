import { result } from '../../tags/results'
import { eq } from '../eq'
import { once } from '../sources/pull/once'
import { preview, previewAsync } from './preview'

describe('preview', () => {
	it('previews value synchronously', () => {
		expect(preview(eq<number>())(1)).toEqual(result.success.of(1))
	})

	it('previews value from source synchronously', () => {
		expect(preview(eq<number>())(once(1))).toEqual(result.success.of(1))
	})

	it('previews value async', async () => {
		expect(await previewAsync(eq<number>())(1)).toEqual(result.success.of(1))
	})

	it('previews value from source async', async () => {
		expect(await previewAsync(eq<number>())(once(1))).toEqual(
			result.success.of(1),
		)
	})
})
