import { expect } from 'vitest'

import { flow } from '../../../functions/flow'
import { pipe } from '../../../functions/pipe'
import { collect, preview, REMOVE, update } from '../../extractors'
import { once } from '../../sources/sync/once'
import { join } from './join'
import { prop } from './optional/prop'
import { elems } from './traversal/elems'

type Data = {
	current: string[]
	people: Partial<Record<string, string>>
}

const people: Data['people'] = {
	alice: 'Alice',
	bob: 'Bob',
	charlie: 'Charlie',
}

describe('join, many', () => {
	const o = flow(
		once<Data>(),
		prop('current'),
		elems(),
		join((current) => pipe(prop('people'), prop(current))),
	)
	test('preview, success', () => {
		const data: Data = {
			current: ['alice', 'charlie', 'toto'],
			people,
		}
		expect(collect(o)(data)).toEqual(['Alice', 'Charlie'])
	})
	test('preview, failure', () => {
		const data: Data = {
			current: ['toto'],
			people,
		}
		expect(preview(o)(data).type).toBe('failure')
	})
	test('update', () => {
		const data: Data = {
			current: ['alice', 'charlie', 'toto'],
			people,
		}
		expect(update(o)(() => 'TOTO', data)).toEqual({
			current: 'bob',
			people: {
				alice: 'TOTO',
				bob: 'Bob',
				charlie: 'TOTO',
			},
		})
	})
	test('remove', () => {
		const data: Data = {
			current: ['alice', 'charlie', 'toto'],
			people,
		}
		expect(update(o)(REMOVE, data)).toEqual({
			current: 'bob',
			people: {
				bob: 'Bob',
			},
		})
	})
})
