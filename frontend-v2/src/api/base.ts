export const apiBaseUrl = import.meta.env.VITE_APP_BACKEND_HOST
	? `${import.meta.env.VITE_APP_BACKEND_HOST}/api`
	: "http://localhost:4500/api";

export interface ResponseParsed<T> {
	data: T;
	page: number;
	pageSize: number;
	totalPages: number;
	totalRecords: number;
}

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
	const headerOptions: RequestInit = {
		...options,
		headers: { ...options?.headers, "Content-Type": "application/json" },
		credentials: "include",
	};
	return fetch(url, headerOptions).then(handleSuccess).catch(handleError);
}

export const handleSuccess = async (response: Response) => {
	let page = 0;
	let pageSize = 0;
	let totalPages = 0;
	let totalRecords = 0;

	console.log(Object.fromEntries(response.headers));
	const paginationString = response.headers.get("X-Pagination");

	if (paginationString) {
		try {
			const parse = JSON.parse(paginationString);
			console.log("parsed json", parse);

			page = parse?.Page ? parse?.Page : page;
			pageSize = parse?.PageSize ? parse?.PageSize : pageSize;
			totalRecords = parse?.TotalRecords ? parse?.TotalRecords : totalRecords;
			totalPages = parse?.TotalPages ? parse?.TotalPages : totalPages;
		} catch (error) {
			console.log("failed parsing pagination from headers");
		}
	}

	if (response.ok) {
		const dto: ResponseParsed<any> = {
			data: await response.json(),
			page,
			pageSize,
			totalPages,
			totalRecords,
		};
		return dto as any;
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
