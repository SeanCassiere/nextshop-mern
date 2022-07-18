export function formatTextDate(date: string) {
	return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: undefined }).format(new Date(date));
}

export function formatShortDate(date: string) {
	return new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: undefined }).format(new Date(date));
}

export function formatPrice(price: number, decimalPoints: number = 2) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: decimalPoints,
		minimumFractionDigits: decimalPoints,
	}).format(price);
}
