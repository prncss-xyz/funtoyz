import { directMachine, Tags } from '@funtoyz/core'
import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useMachine } from './useMachine'

describe('useMachine', () => {
	test('onSend map dispatches to the matching tag handler', async () => {
		type EventOut = Tags<{
			panic: void
			toast: string
		}>

		const machine = directMachine<EventOut>()(0, {
			emit: (_: void, n: number, send) => {
				send({ payload: undefined, type: 'panic' })
				send({ payload: 'hello', type: 'toast' })
				return n
			},
		})

		const panic = vi.fn()
		const toast = vi.fn()
		const { result } = renderHook(() =>
			useMachine(machine(), {
				panic,
				toast,
			}),
		)

		act(() => {
			result.current.send({ payload: undefined, type: 'emit' })
		})

		await Promise.resolve()

		expect(panic).toHaveBeenCalledTimes(1)
		expect(panic).toHaveBeenCalledWith(undefined)
		expect(toast).toHaveBeenCalledTimes(1)
		expect(toast).toHaveBeenCalledWith('hello')
	})
})
