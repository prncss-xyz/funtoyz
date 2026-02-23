import { traversal } from '.'
import { flow } from '../../../../functions/flow'
import { reduce } from '../../../../reduce'
import { collect } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { toJoin } from './join'

describe('joinFold, view', () => {
	test('trailing', () => {
		const o = flow(once<string>(), traversal(toJoin(',', true)))
		const res = collect(o)('a,b,c,')
		expect(res).toEqual(['a', 'b', 'c'])
	})
	test('not trailing', () => {
		const o = flow(once<string>(), traversal(toJoin(',', false)))
		const res = collect(o)('a,b,c,')
		expect(res).toEqual(['a', 'b', 'c', ''])
	})
})

describe('toJoin, reduce', () => {
	test('trailing', () => {
		const res = reduce(toJoin(',', true), ['a', 'b', 'c'])
		expect(res).toBe('a,b,c,')
	})
	test('not trailing', () => {
		const res = reduce(toJoin(',', false), ['a', 'b', 'c'])
		expect(res).toBe('a,b,c')
	})
})
