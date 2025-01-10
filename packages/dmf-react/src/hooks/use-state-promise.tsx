import { useState } from 'react';

type SetStatePromise<T> = (newValue: T) => Promise<void>;

function useStatePromise<T>(initialValue: T): [T, SetStatePromise<T>] {
	const [state, setState] = useState<T>(initialValue);
	const setStatePromise: SetStatePromise<T> = (newValue: T) => {
		return new Promise<void>((resolve) => {
			setState(newValue);
			resolve();
		});
	};
	return [state, setStatePromise];
}

export default useStatePromise;