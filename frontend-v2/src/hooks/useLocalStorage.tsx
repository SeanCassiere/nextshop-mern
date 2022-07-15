import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(storageKey: string, initialValue: T) {
	const [value, setValue] = useState<T>(initialValue);

	useEffect(() => {
		const item = window.localStorage.getItem(storageKey);
		if (item) {
			try {
				const readContent = JSON.parse(item) as T;
				setValue(readContent);
			} catch (error) {
				console.error(`Error reading for useLocalStorage for ${storageKey}`);
			}
		} else {
			try {
				const writeContent = JSON.stringify(initialValue);
				window.localStorage.setItem(storageKey, writeContent);
				setValue(initialValue);
			} catch (error) {
				console.error(`Error writing for useLocalStorage for ${storageKey}`);
			}
		}
	}, [initialValue, storageKey]);

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

	return { value, setItemForBoth };
}
