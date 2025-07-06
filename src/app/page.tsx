import StatsView from "./components/views/StatsView";
import NavBar from "./components/layout/Navbar";
import LiveClock from "./components/views/LiveClock";
import { SettingsProvider } from "./components/SettingsProvider";
import { logout } from "@/serveractions/logout";

export default function Home() {
	return (
		<SettingsProvider>
			<main className="bg-[url('../../public/bgmobile.png')] md:bg-[url('../../public/bgfhd.png')] min-h-screen">
				<header className="bg-[rgba(33,48,78,0.7)] backdrop-blur-lg border-b border-white/10 w-full p-6 shadow-xl">
					<div className="flex items-center justify-between relative">
						<div className="md:absolute left-0">
							<NavBar />
						</div>
						<h1 className="text-4xl bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent font-bold w-full text-center">
            Server Dashboard
						</h1>
						<form action={logout} className="md:absolute right-0">
							<button
								type="submit"
								className="p-2 bg-amber-400"
							>
								out
							</button>
						</form>
					</div>
				</header>
				<div className="max-w-7xl m-auto p-6 ">
					<LiveClock />
					<StatsView/>
				</div>
			</main>
		</SettingsProvider>
	);
}