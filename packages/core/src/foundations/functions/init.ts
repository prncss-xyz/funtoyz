import { isFunction } from '../guards'
import { NonFunction } from '../types'

export type Init<T, P = void> = ((p: P) => T) | NonFunction<T>

export function fromInit<T, P = void>(init: Init<T, P>, p: P): T {
	return isFunction(init) ? init(p) : init
}
