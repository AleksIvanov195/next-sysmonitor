const API = {
	get: (endpoint: string) => callFetch(endpoint, "GET"),
	post: <T>(endpoint: string, data?: T) => callFetch(endpoint, "POST", data),
	put: <T>(endpoint: string, data?: T) => callFetch(endpoint, "PUT", data),
	delete: (endpoint: string) => callFetch(endpoint, "DELETE"),
};

const callFetch = async (endpoint: string, method: string, data?: unknown) => {
	const requestObj: RequestInit = {
		method,
		headers: { "Content-Type": "application/json" },
		...(typeof data !== "undefined" ? { body: JSON.stringify(data) } : {}),
	};

	try {
		const response = await fetch(endpoint, requestObj);
		if (response.status === 204) return { isSuccess: true, result: null };

		if (response.status === 401) {
			window.location.href = "/login";
		}
		const result = await response.json().catch(() => null);
		if (response.ok) {
			return { isSuccess: true, result };
		} else {
			return {
				isSuccess: false,
				message: (result && result.message) || "An error occurred",
				status: response.status,
			};
		}
	} catch (error: unknown) {
		return {
			isSuccess: false,
			message: `Error: ${error instanceof Error ? error.message : String(error)}`,
		};
	}
};

export default API;
