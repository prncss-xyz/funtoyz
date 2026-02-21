export type HasSameSync<F2, F1> = F1 extends { SYNC: false }
	? F2 extends { SYNC: false }
		? F2
		: never
	: F2 extends { SYNC: false }
		? never
		: F2
