import { flow } from '../../../../functions/flow'
import { update, view } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { reread } from './reread'

describe('reread', () => {
	const o = flow(
		once<string>(),
		reread((s) => s.toUpperCase()),
	)
	it('view', () => {
		expect(view(o)('foo')).toBe('FOO')
	})
	it('update', () => {
		expect(update(o)('')('foo')).toBe('')
	})
})
