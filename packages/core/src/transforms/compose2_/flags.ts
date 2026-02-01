type FlagName = 'CONSTRUCT' | 'EXISTS' | 'READ' | 'SYNC' | 'UNIQUE' | 'WRITE'

export type TestFlag<
	Flag extends FlagName,
	Target extends { flags: Flags },
> = Target['flags'][Flag] extends false ? never : unknown

export type Flags = Partial<Record<FlagName, false>>

export function mergeFlags<A extends Flags, B extends Flags>(a: A, b: B): A & B
export function mergeFlags(a: Record<string, false>, b: Record<string, false>) {
	const res: Record<string, false> = {}
	for (const key in a) res[key] = false
	for (const key in b) res[key] = false
	return res
}
