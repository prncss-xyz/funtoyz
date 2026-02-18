import { expect } from 'vitest'

import { flow } from '../../../functions/flow'
import { pipe } from '../../../functions/pipe'
import { preview } from '../../extractors'
import { once } from '../../sources/sync/once'
import { join } from './join'
import { prop } from './optional/prop'

type Data = {
	current: string
	people: Partial<Record<string, { age: number; name: string }>>
}

const people: Data['people'] = {
	alice: { age: 30, name: 'Alice' },
	bob: { age: 25, name: 'Bob' },
	charlie: { age: 35, name: 'Charlie' },
}

describe('join', () => {
	const o = flow(
		once<Data>(),
		prop('current'),
		join((current) => pipe(prop('people'), prop(current), prop('name'))),
	)
	test('preview, success', () => {
		const data: Data = {
			current: 'bob',
			people,
		}
		expect(preview(o)(data)).toEqual({ type: 'success', value: 'Bob' })
	})
	test('preview, failure', () => {
		const data: Data = {
			current: 'toto',
			people,
		}
		expect(preview(o)(data).type).toBe('failure')
	})
})
