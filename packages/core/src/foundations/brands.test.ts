import { successful } from './assertions'
import { brandCaster, Branded, brandParser } from './brands'
import { flow } from './functions/flow'
import { nothing, result } from './results'

describe('brandCaster', () => {
	const pos = brandCaster<'positive', number>()
	const odd = brandCaster<'odd', number>()
	const x = flow(1, pos, odd)
	test('compose brands', () => {
		expect(x).toBe(1)
		function fromPos(n: Branded<'positive', number>) {
			return n
		}
		function fromOdd(n: Branded<'odd', number>) {
			return n
		}
		fromPos(x)
		fromOdd(x)

		// @ts-expect-error should be rejected
		fromPos(1)
		// @ts-expect-error should be rejected
		fromOdd(1)
	})
})

describe('brandParser', () => {
	const odd = brandCaster<'odd', number>()
	const pos = brandParser('positive', (n: number) =>
		n > 0 ? result.success.of(undefined) : result.failure.of(nothing.of()),
	)
	test('compose brands', () => {
		const x = successful(pos(odd(1)))
		expect(x).toBe(1)
		function fromPos(n: Branded<'positive', number>) {
			return n
		}
		function fromOdd(n: Branded<'odd', number>) {
			return n
		}
		fromPos(x)
		fromOdd(x)

		// @ts-expect-error should be rejected
		fromPos(1)
		// @ts-expect-error should be rejected
		fromOdd(1)
	})
	test('failure', () => {
		const x = pos(-1)
		expect(result.failure.is(x)).toBeTruthy()
	})
})
