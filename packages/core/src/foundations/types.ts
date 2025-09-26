export type Prettify<T> = unknown & {
	[K in keyof T]: T[K]
}

export type Equals<T, U> = [T] extends [U]
	? [U] extends [T]
		? unknown
		: never
	: never

export type ValueUnion<T> = Prettify<T[keyof T]>
// Type of the intersection of the values

export type ValueIntersection<T> = Prettify<
	{
		[K in keyof T]: (x: T[K]) => void
	} extends {
		[K: PropertyKey]: (x: infer I) => void
	}
		? I
		: never
>

export type AnyFunction = (...args: any[]) => any
export type NonFunction<T> = T extends AnyFunction ? never : T

export type UnionToIntersection<U> = (
	U extends any ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never

// https://stackoverflow.com/questions/74697633/how-does-one-deduplicate-a-union
export type Dedupe<
	T,
	L = LastOf<T>,
	N = [T] extends [never] ? true : false,
> = true extends N ? never : Dedupe<Exclude<T, L>> | L

type LastOf<T> =
	UnionToIntersection<T extends any ? () => T : never> extends () => infer R
		? R
		: never

export type Modify<T> = (t: T) => T

// TODO: maybe remove
export type FromResulter<T> = T extends (u: any) => u is infer R
	? R
	: T extends (u: any) => infer R
		? R
		: never
