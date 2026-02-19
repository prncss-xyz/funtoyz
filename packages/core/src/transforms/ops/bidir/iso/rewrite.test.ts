import { flow } from '../../../../functions/flow'
import { review, update } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { rewrite } from './rewrite'

describe('rewrite', () => {
	const o = flow(
		once<string>(),
		rewrite((s) => s.toUpperCase()),
	)
	it('review', () => {
		expect(review(o)('foo')).toBe('FOO')
	})
	it('update', () => {
		expect(update(o)('')('foo')).toBe('')
		/* expect(update(focus)('', 'foo')).toBe('foo') */
	})
})
