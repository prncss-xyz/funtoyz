import { fromInit, Init } from '../functions/arguments/init'
import { id } from '../functions/basics'

export interface ReducerNonDest<Event, State, Result = State> {
	init: Init<State>
	reduce: (event: Event, state: State) => State
	result?: (state: State) => Result
}

export type Reducer<Event, State = Event, Result = State> = {
	init: Init<State>
	result?: (state: State) => Result
} & (
	| {
			reduce: (event: Event, state: State) => State
			reduceDest?: (event: Event, state: State) => State
	  }
	| {
			reduceDest: (event: Event, state: State) => State
	  }
)

export function reduce<Event, State, Result = State>(
	reducer: Reducer<Event, State, Result>,
	events: Iterable<Event>,
) {
	let acc = fromInit(reducer.init)
	const reduceDest = reducer.reduceDest ?? ((reducer as any).reduce as never)
	const result = reducer.result ?? (id as never)
	for (const event of events) acc = reduceDest(event, acc)
	return result(acc)
}

export function reduce1<Event, State, Result = State>(
	reducer: Reducer<Event, State, Result>,
	events: Iterable<Event>,
) {
	let acc = fromInit(reducer.init)
	const reduceDest = reducer.reduceDest ?? ((reducer as any).reduce as never)
	const result = reducer.result ?? (id as never)
	for (const event of events) acc = reduceDest(event, acc)
	return result(acc)
}
