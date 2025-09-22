import { AnyTag, Tag, tags, Tags } from './core'

export type Result<S, F extends Tag<any, any>> = Tags<{
	failure: F
	success: S
}>

export type AnyResult = Result<any, AnyTag>

export const result = tags<Result<unknown, AnyTag>>()('failure', 'success')

export type Nothing = Tag<'nothing', void>
export const { nothing } = tags<Nothing>()('nothing')
