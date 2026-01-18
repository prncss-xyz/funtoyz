import { forbidden } from '../assertions'
import { tag } from './tag'
import { tags } from './tags'
import { AnyTag, Tag, Tags } from './types'

export type Result<S, F extends Tag<any, any>> = Tags<{
	failure: F
	success: S
}>

export type AnyResult = Result<any, AnyTag>
export const result = tags<AnyResult>()('failure', 'success')

export type Nothing = Tag<'nothing', void>
export function nothing() {
	return tag('failure', tag('nothing'))
}

function successful_<T>(value: Result<T, AnyTag>, message?: string) {
	if (result.success.is(value)) return result.success.get(value)
	forbidden(message ?? 'Unexpected failure')
}

export function successful(message?: string): <T>(value: Result<T, AnyTag>) => T
export function successful<T>(value: Result<T, AnyTag>, message?: string): T
export function successful(...args: any[]): any {
	switch (args.length) {
		case 1:
			if (typeof args[0] === 'string')
				return function (a0: any) {
					return successful_(a0, args[0])
				}
			return successful_(args[0])
		case 2:
			return successful_(args[0], args[1])
		/* c8 ignore next 2 */
		default:
			return forbidden()
	}
}
