import { getTT } from './tags2'
import { Tags } from './types'

describe('tags2', () => {
	test('get', () => {
		const t: Tags<{ a: number; b: string }> = { payload: 42, type: 'a' }
    const tt = getTT<'a' | 'b'>()
		const x = tt.a.get(t)
	})
})
