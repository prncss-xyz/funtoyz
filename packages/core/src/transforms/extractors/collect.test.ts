import { eq } from '../eq'
import { Source } from '../types'
import { collect } from './collect'

describe('collect', () => {
	it('throws unexpected error when source errors', () => {
		const errorSource: Source<number, string> = (_next, error, _complete) => {
			return {
				start: () => {
					error('some error')
				},
				unmount: () => {},
			}
		}

		expect(() => collect(eq<number>())(errorSource as any)).toThrowError(
			'unexpected error',
		)
	})
})
