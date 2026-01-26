import { flow } from '../../../functions/flow'
import { result } from '../../../tags/results'
import { eq } from '../../eq'
import { preview } from '../../extractors/preview'
import { chars } from '../bidir/traversal'
import { map } from './map'
import { fold, transduce } from './scan'

const sample = 'hello my friends'

function isWordCharacter(s: string) {
	return s !== ' '
}

function length<T>() {
	return {
		init: 0,
		reduce: (_: T, state: number) => state + 1,
	}
}

describe('transduce', () => {
	const o = flow(
		eq<string>(),
		chars(),
		map(isWordCharacter),
		transduce({
			init: false,
			reduce: (next, last, send: (_: void) => void) => {
				if (next && !last) send()
				return next
			},
		}),
		fold(length()),
	)
	test('should count words', () => {
		expect(preview(o)(sample)).toEqual(result.success.of(3))
	})
})

describe('fold', () => {
	const o = flow(
		eq<string>(),
		chars(),
		map(isWordCharacter),
		fold({
			init: () => ({
				count: 0,
				word: false,
			}),
			reduce: (word, state) => ({
				count: !state.word && word ? state.count + 1 : state.count,
				word,
			}),
			result: ({ count }) => count,
		}),
	)
	test('should count words', () => {
		expect(preview(o)(sample)).toEqual(result.success.of(3))
	})
})
