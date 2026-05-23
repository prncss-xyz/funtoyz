import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { createTag } from '../../tags/createTag'
import { tag } from '../../tags/tag'
import { PAYLOAD, PayloadOf, Tag, Tags, TYPE } from '../../tags/types'
import { Prettify } from '../../types'
import { InferMachineEventOut, Machine } from '../core'
import { baseMachine } from './base'

const EXIT = 'exit'
const exit = createTag(EXIT)

type MS<E> = Record<string, Machine<any, E, any, any, any>>

// all props key that can be undefined are optional
type Props<M extends MS<any>> = Tags<{
	[K in keyof M]: M[K] extends Machine<infer T, any, any, any, any> ? T : never
}>

type State<M extends MS<any>> = Tags<{
	[K in keyof M]: M[K] extends Machine<any, any, infer T, any, any> ? T : never
}>

type Result<M extends MS<any>> = Prettify<{
	[K in keyof M]: M[K] extends Machine<any, any, any, infer T, any> ? T : never
}>

export function sumMachine<E, F>() {
  // TODO: exclude K when events out dont have 'exit'
	return function <M extends MS<E>>(ms: M, resend: {[K in keyof M]: (
    e: PayloadOf<InferMachineEventOut<M[K]>, 'exit'>
  ) => State<M> | Tag<typeof EXIT, F>}) {
    // TODO: actual init
		function init(p: any) {
			return tag(p[TYPE], fromInit(ms[p[TYPE]], p[PAYLOAD])) as any
		}
		return baseMachine<E>()<E, State<M>, Props<M>, Result<M>>(
			init,
			(event: any, state, send: (e: E) => void) => {
        let ns = undefined
        const type = state[TYPE]
        const v = ms[type] as any
        const	res = v.reduce(event, state[PAYLOAD], (event: any) => {
          if (exit.is(event)) {
            const res = (resend[state[PAYLOAD] as any] as any)(exit.get(event))

            if (res !== undefined) ns = init(res) 
          }
          else send(event)
        })
				return ns ?? tag(type, res) as any
			},
			(state) => {
        const type = state[TYPE]
        const v = ms[type] as any
        return tag(type, v.result ? v.result(state[PAYLOAD]) : id) as any
			},
		)
	}
}
