"use client";
import { useActionState } from "react";
import { login, LoginFormState } from "@/serveractions/login";

export default function LoginPage() {
	const initialState: LoginFormState = { error: null };
	const [state, formAction, isPending] = useActionState(login, initialState);

	return (
		<main className="flex justify-center items-start min-h-screen bg-gray-700">
			<form action={formAction} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-sm mt-16 flex flex-col gap-6">
				<h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">System Monitor Login</h1>
				<div className="flex flex-col gap-2">
					<label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">Password</label>
					<input id="password" name="password" type="password" required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				{state.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
				<button type="submit" disabled={isPending} className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed">
					{isPending ? "Logging in..." : "Login"}
				</button>
			</form>
		</main>
	);
}