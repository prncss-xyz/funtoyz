type FlagName = 'CONSTRUCT' | 'EXISTS' | 'READ' | 'SYNC' | 'UNIQUE' | 'WRITE'

export type HasFlag<
	Name extends FlagName,
	Target extends Flags,
> = Target[Name] extends false ? never : Target

export type Flags = Partial<Record<FlagName, false>>
