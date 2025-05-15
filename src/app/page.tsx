import StatsView from "./components/views/StatsView";
import NavBar from "./components/layout/Navbar";
export default function Home() {
	const hour = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	const date = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
	return (
		<main className="bg-[url('../../public/bgmobile.png')] md:bg-[url('../../public/bgfhd.png')] min-h-screen">
			<header className="bg-[rgba(33,48,78,0.7)] backdrop-blur-lg border-b border-white/10 w-full p-6 shadow-xl">
				<div className="flex items-center justify-between relative">
					<div className="absolute left-0">
						<NavBar />
					</div>
					<h1 className="text-4xl bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent font-bold w-full text-center">
            Server Dashboard
					</h1>
				</div>
			</header>
			<div className="max-w-7xl m-auto p-6 ">
				<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex flex-col items-center justify-center gap-1 mb-6">
					<p className="text-5xl font-bold text-white/90">{hour}</p>
					<p className="text-xl font-medium text-white/70">
						<span className="capitalize">{date}</span>
					</p>
				</div>
				<StatsView/>
			</div>
		</main>
	);
}