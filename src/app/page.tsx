import StatsView from "./components/views/StatsView";
export default function Home() {
	return (
		<main className="bg-[url('../../public/bgmobile.png')] md:bg-[url('../../public/bgfhd.png')] min-h-screen">
			<header className="bg-[rgba(33,48,78,0.7)] backdrop-blur-lg border-b border-white/10 w-full p-6 shadow-xl">
				<h1 className="text-4xl bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent text-center font-bold ">
			Server Dashboard
				</h1>
				<div className="mt-2 flex justify-center space-x-4">
					<span className="text-blue-300/80 text-sm font-medium">Correct CPU & Disk data not showing? Refresh Now!</span>
				</div>
			</header>
			<StatsView/>

		</main>
	);
}