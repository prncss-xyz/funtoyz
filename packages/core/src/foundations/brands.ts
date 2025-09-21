import { id } from './functions/basics'
import { result, Result } from './results'
import { AnyTag } from './tags'

export declare const BRAND: unique symbol

export type Branded<Brand extends PropertyKey, Value = unknown> = Value & {
	readonly [BRAND]: { readonly [K in Brand]: true }
}

export function brandCaster<Brand extends PropertyKey, Value = unknown>() {
	return id as <V extends Value>(value: V) => Branded<Brand, V>
}

export function brandParser<
	const Brand extends PropertyKey,
	Value,
	F extends AnyTag,
>(_brand: Brand, parse: (value: Value) => Result<void, F>) {
	return <V extends Value>(value: V): Result<Branded<Brand, V>, F> => {
		const res = parse(value)
		if (result.failure.is(res)) return res
		return result.success.of(value) as Result<Branded<Brand, V>, F>
	}
}
