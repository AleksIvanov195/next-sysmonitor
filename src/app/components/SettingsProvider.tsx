"use client";
import { useContext, createContext, ReactNode } from "react";
import useLoad from "./apiutils/useLoad";
import { useState } from "react";
import { AppSettings } from "@/lib/settings/settingsManager";
import API from "./apiutils/API";

interface SettingsContext{
  settings: AppSettings | null;
	settingsMessage: string | null;
  isLoading: boolean;
	isUpdating: boolean;
	isBusy: boolean;
  reloadSettings: () => void;
  updateSetting: (data: Partial<AppSettings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContext | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const[settings,, settingsMessage, isLoading, reloadSettings] = useLoad<AppSettings>("/api/settings");
	const [isUpdating, setIsUpdating] = useState(false);

	const isBusy = isLoading || isUpdating;

	const updateSetting = async (settingData: Partial<AppSettings>) => {
		if (isUpdating) return;
		setIsUpdating(true);
		try {
			const response = await API.put("/api/edit-setting", settingData);
			if (response.isSuccess) {
				// Wait sometime for settings monitor to process
				await new Promise(resolve => setTimeout(resolve, 500));
			}
			reloadSettings();
		} finally {
			setIsUpdating(false);
		}
	};

	return(
		<SettingsContext.Provider value={{ settings, settingsMessage, isLoading, isUpdating, isBusy, reloadSettings, updateSetting }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	return context as SettingsContext;
};