"use client";
import { useEffect, useState } from "react";
import { CpuInfo, MemoryInfo, DiskInfo, SystemLoad } from '@/lib/systemInfo';

type SystemData = {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo[];
  currentLoad: SystemLoad;
};

export default function Home() {
	const [data, setData] = useState<SystemData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
			const res = await fetch('/api/system-info');
			const result = await res.json() as SystemData;
      setData(result);
    };
    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;
	console.log(data)
  return (
<main className="bg-[url('../../public/bgfhd.png')] min-h-screen">
	<header className="bg-[rgba(33,48,78,0.7)] backdrop-blur-lg border-b border-white/10 w-full p-6 shadow-xl">
		<h1 className="text-4xl bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent text-center font-bold ">
			Server Dashboard
		</h1>
		<div className="mt-2 flex justify-center space-x-4">
			<span className="text-blue-300/80 text-sm font-medium">Last Updated: 2 mins ago</span>
		</div>
	</header>
  <div className="max-w-7xl m-auto p-6">

    <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex flex-col items-center justify-center gap-1 mb-6">
      <p className="text-5xl font-bold text-white/90">12:46</p>
      <p className="text-xl font-medium text-white/70">
        <span className="capitalize">March 28th, 2025</span>
      </p>
    </div>

    <div className="flex flex-col justify-center md:flex-row gap-3">
      <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex-1/4">
        <h3 className="text-lg font-medium text-white/90 text-center">Disk Usage</h3>
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="h-32 w-32 rounded-full border-4 border-white/20 flex items-center justify-center">
            <span className="text-white/50 text-sm">Donut Chart</span>
          </div>
        </div>
        <p className="text-3xl font-bold mt-2 text-center text-white/90">24%</p>
      </div>

      <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex-1/4">
        <h3 className="text-lg font-medium text-white/90">CPU Usage</h3>
        <p className="text-3xl font-bold mt-2 text-white/90">62%</p>
      </div>

      <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex-1/4">
        <h3 className="text-lg font-medium text-white/90">Memory</h3>
        <p className="text-3xl font-bold mt-2 text-white/90">45%</p>
      </div>

      <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex-1/4">
        <h3 className="text-lg font-medium text-white/90">System Load</h3>
        <p className="text-3xl font-bold mt-2 text-white/90">45%</p>
      </div>
    </div>

  </div>
</main>
  );
}