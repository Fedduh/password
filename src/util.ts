// Return a depp copy
export const copyArray = <T,>(obj: T): T => {
	return JSON.parse(JSON.stringify(obj));
}
