import { useCallback, useEffect, useMemo, useState } from "react";

export function useLocalStorage<T>(storageKey: string, initialValue: T): [T, (value: T) => void] {
	const [value, setValue] = useState<T>(initialValue);

	const setItemForBoth = useCallback(
		(item: T) => {
			try {
				const writeContent = JSON.stringify(item);
				window.localStorage.setItem(storageKey, writeContent);
			} catch (error) {
				console.error(`Error writing for useLocalStorage for ${storageKey}`);
			}
			setValue(item);
		},
		[storageKey]
	);

	useEffect(() => {
		const localStorageString = window.localStorage.getItem(storageKey);
		if (localStorageString) {
			try {
				const readContent = JSON.parse(localStorageString) as T;
				setValue(readContent);
			} catch (error) {
				console.error(`Error reading for useLocalStorage for ${storageKey}`);
			}
		} else {
			setItemForBoth(initialValue);
		}
	}, [initialValue, setItemForBoth, storageKey]);

	const memoValue = useMemo(() => value, [value]);

	return [memoValue, setItemForBoth];
}
