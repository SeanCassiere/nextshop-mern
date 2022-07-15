export const apiBaseUrl = import.meta.env.VITE_APP_BACKEND_HOST
	? `${import.meta.env.VITE_APP_BACKEND_HOST}/api`
	: "http://localhost:4500/api";

export function makeUrl(endpoint: string, params: Record<string, string | number | null>) {
	const queryParams = new URLSearchParams();

	for (const key of Object.entries(params)) {
		const [keyName, value] = key;
		queryParams.append(keyName, `${value}`);
	}

	const queryUrl = new URL(`${apiBaseUrl}${endpoint}`);
	queryUrl.search = queryParams.toString();

	return queryUrl;
}

export async function callApi(url: RequestInfo | URL, options?: RequestInit) {
	const headerOptions = { ...options, headers: { ...options?.headers, "Content-Type": "application/json" } };
	return fetch(url, headerOptions).then(handleSuccess).catch(handleError);
}

export const handleSuccess = async (response: Response) => {
	if (response.ok) {
		return await response.json();
	} else {
		await response.json().then((data) => {
			const message = data?.message || "Something went wrong";
			throw message;
		});
	}
};

export const handleError = (error: Error) => {
	throw error;
};
