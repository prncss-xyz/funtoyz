import { id } from './functions/basics'

export declare const BRAND: unique symbol

export type Brand<Identifier extends PropertyKey> = {
	readonly [BRAND]: { readonly [K in Identifier]: true }
}

export function brandCast<Identifier extends PropertyKey, Value = unknown>() {
	return id as <V extends Value>(value: V) => Brand<Identifier> & V
}

export function brandGuard<const Identifier extends PropertyKey, Value>(
	_brand: Identifier,
	condition: (value: Value) => boolean,
) {
	return condition as <V extends Value>(
		value: V,
	) => value is Brand<Identifier> & V
}
