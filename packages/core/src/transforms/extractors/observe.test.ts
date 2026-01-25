import { eq } from '../eq'
import { once } from '../sources/pull/once'
import { observe } from './observe'

describe('observe', () => {
	it('observes value from source with function observer', () => {
		let res
		observe(once(1), eq<number>(), (x) => {
			res = x
		})
		expect(res).toBe(1)
	})

	it('observes value from source with object observer', () => {
		let res
		observe(once(1), eq<number>(), {
			next: (x) => {
				res = x
			},
		})
		expect(res).toBe(1)
	})

	it('observes completion', () => {
		let completed = false
		observe(once(1), eq<number>(), {
			complete: () => {
				completed = true
			},
		})
		expect(completed).toBe(true)
	})

	it('observes error', () => {
		let error
		const source = (_next: any, err: any, _complete: any) => {
			return {
				start: () => err('oops'),
				unmount: () => {},
			}
		}
		observe(source as any, eq<number>(), {
			error: (e) => {
				error = e
			},
		})
		expect(error).toBe('oops')
	})
})
