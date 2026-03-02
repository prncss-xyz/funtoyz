import { tag } from '@funtoyz/core'
import { atom, createStore, Getter, Setter } from 'jotai'

import { asyncAtomFactory } from './_testUtils'
import { createMachine, jotaiBaseMachine, jotaiDirectMachine } from './machine'

type Event =
	| { n: number; type: 'add' }
	| { type: 'noop' }
	| { type: 'set'; value: number }
	| { type: 'tick' }

type State = { n: number }

describe('machineAtom', () => {
	it('updates result with sync base atom', async () => {
		const store = createStore()
		const demoMachine = jotaiDirectMachine(1, {
			add: (n: number, state) => state + n,
			set: (n: number) => n,
		})
		const { resultAtom } = createMachine(demoMachine())
		expect(store.get(resultAtom)).toEqual(1)
		store.set(resultAtom, tag('add', 2))
		await Promise.resolve()
		expect(store.get(resultAtom)).toEqual(3)
		store.set(resultAtom, tag('set', 4))
		await Promise.resolve()
		expect(store.get(resultAtom)).toEqual(4)
	})

	it('computes next and disabled without committing state', () => {
		const store = createStore()
		const machine = jotaiBaseMachine(
			{ n: 1 },
			(event: Event, state) =>
				event.type === 'add' ? { n: state.n + event.n } : state,
			(state: State) => state.n,
		)
		const { disabled, next, resultAtom } = createMachine(machine())
		expect(store.get(resultAtom)).toBe(1)
		expect(store.get(next({ n: 1, type: 'add' }))).toBe(2)
		expect(store.get(resultAtom)).toBe(1)
		expect(store.get(disabled({ type: 'noop' }))).toBe(true)
		expect(store.get(disabled({ n: 1, type: 'add' }))).toBe(false)
	})

	it('supports async base atom factories', async () => {
		const store = createStore()
		const machine = jotaiBaseMachine(
			{ n: 1 },
			(event: Event, state: State) =>
				event.type === 'add' ? { n: state.n + event.n } : state,
			(state: State) => state,
		)
		const { resultAtom } = createMachine(machine(), asyncAtomFactory)
		expect(await store.get(resultAtom)).toEqual({ n: 1 })
		store.set(resultAtom, { n: 1, type: 'add' })
		await Promise.resolve()
		expect(await store.get(resultAtom)).toEqual({ n: 2 })
	})

	it('dispatches machine messages with get/set access', async () => {
		const store = createStore()
		const countAtom = atom(0)
		const machine = jotaiBaseMachine(
			{ n: 0 },
			(
				event: Event,
				state: State,
				send: (cb: (get: Getter, set: Setter) => void) => void,
			) => {
				if (event.type === 'tick') {
					send((get, set) => set(countAtom, get(countAtom) + 1))
					return { n: state.n + 1 }
				}
				return state
			},
			(state: State) => state,
		)
		const { resultAtom } = createMachine(machine())
		store.set(resultAtom, { type: 'tick' })
		await Promise.resolve()
		expect(store.get(countAtom)).toBe(1)
		expect(store.get(resultAtom)).toEqual({ n: 1 })
	})
})
