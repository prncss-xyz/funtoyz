type FlagName = 'CONSTRUCT' | 'READ' | 'SYNC' | 'UNIQUE' | 'WRITE'

export type HasFlag<Name extends FlagName, Target extends Flags> = {
	[K in Name]: Target[K] extends false ? K : never
}[Name] extends never
	? Target
	: never

export type Flags = Partial<Record<FlagName, false>>
