import { useState, useEffect, useCallback } from "react";
import API from "./API";

const useLoad = <T = unknown>(endpoint: string, shouldLoad = true) => {
	const [data, setData] = useState<T | null>(null);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);


	const loadData = useCallback(async () => {
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
	}, [endpoint, shouldLoad]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return [data, setData, loadingMessage, isLoading, loadData] as const;
};

export default useLoad;