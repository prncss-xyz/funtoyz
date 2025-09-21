import { fromInit, Init } from './functions/init'
import { AnyTag, PayloadOf, TypeIn } from './tags'

type Bound<T extends AnyTag, O> = keyof O extends TypeIn<T> ? O : never
type Pattern<Value extends AnyTag> = {
	[Type in TypeIn<Value>]: (v: PayloadOf<Value, Type>) => any
}

export function matcher<Value extends AnyTag, O extends Pattern<Value>>(
	patterns: O,
): (value: Value) => {
	[K in keyof O]: O[K] extends (...args: any[]) => infer I ? I : never
}[keyof O]
export function matcher<
	Value extends AnyTag,
	O extends Partial<Pattern<Value>>,
	R2,
>(
	patterns: Exclude<Bound<Value, O>, Pattern<Value>>,
	otherwise: Init<R2, Exclude<Value, { type: keyof O }>>,
): (value: Value) =>
	| R2
	| {
			[K in keyof O]: O[K] extends (...args: any[]) => infer I ? I : never
	  }[keyof O]
export function matcher(patterns: any, otherwise?: any) {
	return (value: any) => match(value, patterns, otherwise)
}

export function match<Value extends AnyTag, O extends Pattern<Value>>(
	value: Value,
	patterns: O,
): {
	[K in keyof O]: O[K] extends (...args: any[]) => infer I ? I : never
}[keyof O]
export function match<
	Value extends AnyTag,
	O extends Partial<Pattern<Value>>,
	R2,
>(
	value: Value,
	patterns: Exclude<Bound<Value, O>, Pattern<Value>>,
	otherwise: Init<R2, Exclude<Value, { type: keyof O }>>,
):
	| R2
	| {
			[K in keyof O]: O[K] extends (...args: any[]) => infer I ? I : never
	  }[keyof O]
export function match(value: any, patterns: any, otherwise?: any) {
	if (value.type in patterns)
		return (patterns as any)[value.type](value.payload)
	return fromInit(otherwise, value)
}
