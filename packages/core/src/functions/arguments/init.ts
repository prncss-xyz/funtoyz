import { isFunction } from '../../guards'

export type Init<Res, Args extends any[] = []> = ((...args: Args) => Res) | Res

export function toInit<T, P = void>(init: Init<T, [P]>): (p: P) => T {
	return isFunction(init) ? (p) => init(p) : () => init
}

export function fromInit<Res, Args extends any[] = []>(
	init: Init<Res, Args>,
	...args: Args
): Res {
	return isFunction(init) ? init(...args) : init
}
