import { isFunction } from '../guards'

export type Init<R, Args extends any[] = []> = ((...args: Args) => R) | R

export function fromInit<R, Args extends any[] = []>(
	init: Init<R, Args>,
	...args: Args
): R {
	return isFunction(init) ? init(...args) : init
}

export function toInit<R, Args extends any[] = []>(
	init: Init<R, Args>,
): (...args: Args) => R {
	return isFunction(init) ? init : () => init
}
