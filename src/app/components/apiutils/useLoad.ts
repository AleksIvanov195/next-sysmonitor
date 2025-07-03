import { useState, useEffect } from "react";
import API from "./API";

const useLoad = <T = unknown>(endpoint: string, shouldLoad = true) => {
	const [data, setData] = useState<T | null>(null);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = async () => {
		if (!shouldLoad) return;
		setLoadingMessage(null);
		setIsLoading(true);
		const response = await API.get(endpoint);
		setIsLoading(false);
		if (response.isSuccess) {
			setData(response.result);
		} else {
			setData(null);
			setLoadingMessage(response.message);
		}
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endpoint, shouldLoad]);

	return [data, setData, loadingMessage, isLoading, loadData] as const;
};

export default useLoad;