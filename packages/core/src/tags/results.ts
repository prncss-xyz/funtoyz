import { forbidden } from '../assertions'
import { createTag } from './createTag'
import { tag } from './tag'
import { Tag, Tags } from './types'

export type Result<S, F> = Tags<{
	failure: F
	success: S
}>

export type AnyResult = Result<any, any>

export type Nothing = Tag<'nothing', void>
export function nothing(): Nothing {
	return tag('nothing')
}

function successful_<T>(value: Result<T, any>, message?: string) {
	if (success.is(value)) return success.get(value)
	forbidden(message ?? 'Unexpected failure')
}

export const success = createTag('success')
export const failure = createTag('failure')

// TODO: wtf?
export function successful(message?: string): <T>(value: Result<T, any>) => T
export function successful<T>(value: Result<T, any>, message?: string): T
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
