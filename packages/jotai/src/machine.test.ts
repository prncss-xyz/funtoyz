import { baseMachine } from '@funtoyz/core'
import { atom, createStore } from 'jotai'

import { asyncAtomFactory } from './_testUtils'
import { createMachine } from './machine'

type Event = { n: number; type: 'add' } | { type: 'noop' } | { type: 'tick' }

type State = { n: number }

describe('createMachine', () => {
	it('updates result with sync base atom and prop', async () => {
		const store = createStore()
		const machine = baseMachine<(ef: never) => void>()(
			(prop: number) => ({ n: prop }),
			(event: Event, state: State) =>
				event.type === 'add' ? { n: state.n + event.n } : state,
			(state: State) => state.n,
		)
		const { resultAtom } = createMachine(machine, { prop: 1 })
		expect(store.get(resultAtom)).toBe(1)
		store.set(resultAtom, { n: 2, type: 'add' })
		await Promise.resolve()
		expect(store.get(resultAtom)).toBe(3)
	})

	it('supports async base atom factories', async () => {
		const store = createStore()
		const machine = baseMachine<(ef: never) => void>()(
			{ n: 1 },
			(event: Event, state: State) =>
				event.type === 'add' ? { n: state.n + event.n } : state,
			(state: State) => state,
		)
		const { resultAtom } = createMachine(machine, {
			atomFactory: asyncAtomFactory,
		})
		expect(await store.get(resultAtom)).toEqual({ n: 1 })
		store.set(resultAtom, { n: 1, type: 'add' })
		await Promise.resolve()
		expect(await store.get(resultAtom)).toEqual({ n: 2 })
	})

	it('dispatches effects with get/set access', async () => {
		const store = createStore()
		const countAtom = atom(0)
		const machine = baseMachine<number>()(
			{ n: 0 },
			(event: Event, state: State, send: (ef: number) => void) => {
				if (event.type === 'tick') {
					send(1)
					return { n: state.n + 1 }
				}
				return state
			},
			(state: State) => state.n,
		)
		const { resultAtom } = createMachine(machine, {
			effects: (ef, get, set) => set(countAtom, get(countAtom) + ef),
		})
		store.set(resultAtom, { type: 'tick' })
		await Promise.resolve()
		expect(store.get(countAtom)).toBe(1)
		expect(store.get(resultAtom)).toBe(1)
	})

	it('throws when effects are emitted without handlers', () => {
		const store = createStore()
		const machine = baseMachine<number>()(
			{ n: 0 },
			(event: Event, state: State, send: (ef: number) => void) => {
				if (event.type === 'tick') {
					send(1)
				}
				return state
			},
			(state: State) => state,
		)
		const { resultAtom } = createMachine(machine, { prop: undefined })
		const { process } = globalThis as unknown as {
			process: {
				off: (
					event: 'unhandledRejection',
					handler: (reason: unknown) => void,
				) => void
				on: (
					event: 'unhandledRejection',
					handler: (reason: unknown) => void,
				) => void
			}
		}
		return new Promise<void>((resolve) => {
			const handler = (reason: unknown) => {
				process.off('unhandledRejection', handler)
				expect(String((reason as Error).message ?? reason)).toMatch(
					/Effects are not supported in this machine/,
				)
				resolve()
			}
			process.on('unhandledRejection', handler)
			store.set(resultAtom, { type: 'tick' })
		})
	})
})
