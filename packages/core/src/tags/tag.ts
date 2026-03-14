import { PAYLOAD, type Tag, TYPE } from './types'

type GetObject<Path> = Path extends [PropertyKey]
	? Tag<Path[0], void>
	: GetObject0<Path>
type GetObject0<Path> = Path extends [PropertyKey, unknown]
	? Tag<Path[0], Path[1]>
	: Path extends [PropertyKey, ...infer Rest]
		? Tag<Path[0], GetObject0<Rest>>
		: never

export function tagAll<
	const Path extends [PropertyKey, ...PropertyKey[], any] | [PropertyKey],
>(...path: Path): GetObject<Path>
export function tagAll(...path: any): any {
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

export function tag3<T1 extends PropertyKey, T2 extends PropertyKey, P>(
	t1: T1,
	t2: T2,
	payload: P,
): Tag<T1, Tag<T2, P>>
export function tag3(p1: any, p2: any, p3: any): any {
	return { [PAYLOAD]: { [PAYLOAD]: p3, [TYPE]: p2 }, [TYPE]: p1 }
}

export function tag<Type extends PropertyKey>(type: Type): Tag<Type, void>
export function tag<Type extends PropertyKey, Payload>(
	type: Type,
	payload: Payload,
): Tag<Type, Payload>
export function tag(p1: any, p2?: any) {
	return { [PAYLOAD]: p2, [TYPE]: p1 }
}
