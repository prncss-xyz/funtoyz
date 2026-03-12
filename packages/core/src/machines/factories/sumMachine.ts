import { AnyMachineFactory, MachineFactory } from '../core'
import { baseMachine } from './base'

type MS = Record<string, AnyMachineFactory>

type Props<M extends MS> = {
	[K in keyof M]: M[K] extends MachineFactory<infer T, any, any, any, any, any>
		? T
		: never
}

type EventIn<M extends MS> = {
	[K in keyof M]: M[K] extends MachineFactory<any, infer T, any, any, any, any>
		? T
		: never
}

type State<M extends MS> = {
	[K in keyof M]: M[K] extends MachineFactory<any, any, infer T, any, any, any>
		? T
		: never
}

type Result<M extends MS> = {
	[K in keyof M]: M[K] extends MachineFactory<any, any, any, infer T, any, any>
		? T
		: never
}

export function sumMachine<CW = void, CR = void>() {
	return function <M extends MS>(ms: M) {
		return baseMachine<CW, CR>()<EventIn<M>, State<M>, Props<M>, Result<M>>(
			init: (),
			(event: any, state, send) =>
				(events as any)[event.type](event.payload, state, send),
			result,
		)
	}
}
