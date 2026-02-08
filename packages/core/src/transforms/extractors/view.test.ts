import { Nothing, Result, result } from '../../tags/results'
import { periodic } from '../sources/async/periodic'
import { iter } from '../sources/sync/iter'
import { once } from '../sources/sync/once'
import { collect, preview, view } from './view'

describe('view', () => {
	it('views value synchronously', () => {
		const res = view(once<number>())(1)
		expectTypeOf(res).toEqualTypeOf<number>()
		expect(res).toBe(1)
	})
})

describe('collect', () => {
	it('collect values synchronously', () => {
		const res = collect(iter<number>())([1, 2])
		expectTypeOf(res).toEqualTypeOf<number[]>()
		expect(res).toEqual([1, 2])
	})
})

describe('preview', () => {
	it('previews value asynchronously', async () => {
		const pro = preview(periodic)(1)
		expectTypeOf(pro).toEqualTypeOf<Promise<Result<number, Nothing>>>()
		expect(result.success.is(await pro)).toBeTruthy()
	})
})
