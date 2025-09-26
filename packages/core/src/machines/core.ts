import { AnyTag } from '../foundations/tags/core'

export type Machine<
	Event extends AnyTag,
	State extends AnyTag,
	Context,
	Param,
	Derive extends AnyTag,
> = {
	derive: (stateD: State) => Derive
	init: (param: Param) => State
	send: (event: Event, state: State, context: Context) => State
}

/* c8 ignore next 2 */
export const FINAL = 'final'
export type Final = typeof FINAL
