import { type Tag } from './types'

type GetObject<Path> = Path extends [PropertyKey]
	? Tag<Path[0], void>
	: GetObject0<Path>
type GetObject0<Path> = Path extends [PropertyKey, unknown]
	? Tag<Path[0], Path[1]>
	: Path extends [PropertyKey, ...infer Rest]
		? Tag<Path[0], GetObject0<Rest>>
		: never

export function tag<
	const Path extends [PropertyKey, ...PropertyKey[], any] | [PropertyKey],
>(...path: Path): GetObject<Path>
export function tag(...path: any): any {
	if (path.length === 1) {
		return { type: path[0] }
	}
	return tag0(path)
}
function tag0(path: any): any {
	if (path.length === 2) return { payload: path[1], type: path[0] }
	const [type, ...rest] = path
	return { payload: tag0(rest), type }
}
