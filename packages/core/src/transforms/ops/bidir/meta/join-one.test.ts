import { expect } from 'vitest'

import { flow } from '../../../../functions/flow'
import { pipe } from '../../../../functions/pipe'
import { result } from '../../../../tags/results'
import { collect, preview, REMOVE, update } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { prop } from '../optional/prop'
import { filter } from '../prism/filter'
import { elems } from '../traversal/elems'
import { join } from './join'

type Data = {
	current: string
	people: { id: string; name: string }[]
}

const people: Data['people'] = [
	{ id: 'alice', name: 'Alice' },
	{ id: 'bob', name: 'Bob' },
	{ id: 'bob', name: 'Bob2' },
	{ id: 'charlie', name: 'Charlie' },
]

describe.skip('join, one', () => {
	const o = flow(
		once<Data>(),
		prop('current'),
		join((current) =>
			pipe(
				prop('people'),
				elems(),
				filter((p) => p.id === current),
			),
		),
	)
	test('preview, success', () => {
		const data: Data = {
			current: 'bob',
			people,
		}
		expect(preview(o)(data)).toEqual(
			result.success.of({ id: 'bob', name: 'Bob' }),
		)
		expect(collect(o)(data)).toEqual([
			{ id: 'bob', name: 'Bob' },
			{ id: 'bob', name: 'Bob2' },
		])
	})
	test('preview, failure', () => {
		const data: Data = {
			current: 'toto',
			people,
		}
		expect(preview(o)(data).type).toBe('failure')
	})
	test('update, put', () => {
		const data: Data = {
			current: 'bob',
			people,
		}
		expect(update(o)({ id: 'bob', name: 'B' })(data)).toEqual({
			current: 'bob',
			people: [
				{ id: 'alice', name: 'Alice' },
				{ id: 'bob', name: 'B' },
				{ id: 'bob', name: 'B' },
				{ id: 'charlie', name: 'Charlie' },
			],
		})
		expect(collect(o)(data)).toEqual([
			{ id: 'bob', name: 'Bob' },
			{ id: 'bob', name: 'Bob2' },
		])
	})
	test('update, over', () => {
		const data: Data = {
			current: 'bob',
			people,
		}
		expect(update(o)((entry) => ({ ...entry, name: 'B' }))(data)).toEqual({
			current: 'bob',
			people: [
				{ id: 'alice', name: 'Alice' },
				{ id: 'bob', name: 'B' },
				{ id: 'bob', name: 'B' },
				{ id: 'charlie', name: 'Charlie' },
			],
		})
		expect(collect(o)(data)).toEqual([
			{ id: 'bob', name: 'Bob' },
			{ id: 'bob', name: 'Bob2' },
		])
	})
	test('update, remove', () => {
		const data: Data = {
			current: 'bob',
			people,
		}
		expect(update(o)(REMOVE)(data)).toEqual({
			current: 'bob',
			people: [
				{ id: 'alice', name: 'Alice' },
				{ id: 'charlie', name: 'Charlie' },
			],
		})
		expect(collect(o)(data)).toEqual([
			{ id: 'bob', name: 'Bob' },
			{ id: 'bob', name: 'Bob2' },
		])
	})
})
