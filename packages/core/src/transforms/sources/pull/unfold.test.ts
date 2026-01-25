import { result } from '../../../tags/results'
import { eq } from '../../eq'
import { collect } from '../../extractors/collect'
import { unfold } from './unfold'

const collector = collect(eq<number>())

describe('unfold', () => {
	test('', () => {
		const res = collector(
			unfold(0, (acc) =>
				acc < 3 ? result.success.of(acc + 1) : result.failure.of('empty'),
			),
		)
		expect(res).toEqual([1, 2, 3])
	})
})
