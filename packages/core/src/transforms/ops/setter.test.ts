import { flow } from '../../functions/flow'
import { REMOVE, update } from '../extractors'
import { once } from '../sources/sync/once'
import { setter } from './setter'

describe('setter', () => {
	const sourceDefined = ['a', 'c', 'b']
	const o = flow(
		once<string[]>(),
		setter((asc: boolean, w) =>
			w.sort((a, b) => (asc ? a.localeCompare(b) : b.localeCompare(a))),
		),
	)
	describe('put', () => {
		it('defined, true', () => {
			expect(update(o)(true)(sourceDefined)).toEqual(['a', 'b', 'c'])
			// @ts-expect-error should not allow over
			update(o)((x) => !x)
			// @ts-expect-error should not allow remove
			update(o)(REMOVE)
		})
		it('defined, false', () => {
			expect(update(o)(false)(sourceDefined)).toEqual(['c', 'b', 'a'])
		})
	})
})
