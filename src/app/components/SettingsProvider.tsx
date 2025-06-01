"use client";
import { useContext, createContext, ReactNode } from "react";
import useLoad from "./apiutils/useLoad";
import { AppSettings } from "@/lib/settings/settingsManager";
import API from "./apiutils/API";

interface SettingsContext{
  settings: AppSettings | null;
	settingsMessage: string;
  isLoading: boolean;
  reloadSettings: () => void;
  updateSetting: (data: Partial<AppSettings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContext | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const[settings,, settingsMessage, isLoading, reloadSettings] = useLoad<AppSettings>("/api/settings");

	const updateSetting = async (settingData: Partial<AppSettings>) => {
		if (isLoading) return;
		await API.put("/api/edit-setting", settingData);

		// Wait a short time for settings monitor to process
		await new Promise(resolve => setTimeout(resolve, 500));
		reloadSettings();
	};

	return(
		<SettingsContext.Provider value={{ settings, settingsMessage, isLoading, reloadSettings, updateSetting }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	return context as SettingsContext;
};