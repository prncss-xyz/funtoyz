import { Brand, brandCast, brandGuard } from './brands'
import { flow } from './functions/flow'

describe('brandCaster', () => {
	const pos = brandCast<'positive', number>()
	const odd = brandCast<'odd', number>()
	const x = flow(1, pos, odd)
	test('compose brands', () => {
		expect(x).toBe(1)
		function fromPos(n: Brand<'positive'> & number) {
			return n
		}
		function fromOdd(n: Brand<'odd'> & number) {
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
	const toOdd = brandCast<'odd', number>()
	const isPos = brandGuard('positive', (n: number) => n > 0)
	test('compose brands', () => {
		function fromPos(n: Brand<'positive'> & number) {
			return n
		}
		function fromOdd(n: Brand<'odd'> & number) {
			return n
		}
		;((x: number) => {
			const p = toOdd(x)
			if (isPos(p)) {
				fromPos(p)
				fromOdd(p)
			}
		})(1)

		// @ts-expect-error should be rejected
		fromPos(1)
		// @ts-expect-error should be rejected
		fromOdd(1)
	})
	test('failure', () => {
		const x = isPos(-1)
		expect(x).toBeFalsy()
	})
})
