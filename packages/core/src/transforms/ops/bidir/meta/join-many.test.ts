import { expect } from 'vitest'

import { flow } from '../../../../functions/flow'
import { pipe } from '../../../../functions/pipe'
import { collect, preview, REMOVE, update } from '../../../extractors'
import { once } from '../../../sources/sync/once'
import { prop } from '../optional/prop'
import { elems } from '../traversal/elems'
import { join } from './join'

type Data = {
	current: string[]
	people: Partial<Record<string, string>>
}

const people: Data['people'] = {
	alice: 'Alice',
	bob: 'Bob',
	charlie: 'Charlie',
}

describe.skip('join, many', () => {
	const o = flow(
		once<Data>(),
		prop('current'),
		elems(),
		join((current) => pipe(prop('people'), prop(current))),
	)
	test('preview, success', () => {
		const data: Data = {
			current: ['alice', 'alice', 'charlie', 'toto'],
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
	test('update, put', () => {
		const data: Data = {
			current: ['alice', 'alice', 'charlie', 'toto'],
			people,
		}
		expect(update(o)('TOTO')(data)).toEqual({
			current: ['alice', 'alice', 'charlie', 'toto'],
			people: {
				alice: 'TOTO',
				bob: 'Bob',
				charlie: 'TOTO',
			},
		})
	})
	test('update, over', () => {
		const data: Data = {
			current: ['alice', 'alice', 'charlie', 'toto'],
			people,
		}
		expect(update(o)((x) => x + x)(data)).toEqual({
			current: ['alice', 'alice', 'charlie', 'toto'],
			people: {
				alice: 'AliceAlice',
				bob: 'Bob',
				charlie: 'CharlieCharlie',
			},
		})
	})
	test('update, remove', () => {
		const data: Data = {
			current: ['alice', 'alice', 'charlie', 'toto'],
			people,
		}
		expect(update(o)(REMOVE)(data)).toEqual({
			current: ['alice', 'alice', 'charlie', 'toto'],
			people: {
				bob: 'Bob',
			},
		})
	})
})
