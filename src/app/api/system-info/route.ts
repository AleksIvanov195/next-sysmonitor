import { NextResponse } from 'next/server';
import si from 'systeminformation';

interface CpuInfo {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
}

interface MemoryInfo {
  total: number;
  used: number;
  free: number;
}

interface DiskInfo {
  fs: string;
  size: number;
  used: number;
  mount: string;
}

interface SystemLoad {
  avgLoad: number;
  currentLoad: number;
}

export async function GET() {
	const [cpu, memory, disk, currentLoad] : [CpuInfo, MemoryInfo, DiskInfo[], SystemLoad] = await Promise.all([
		si.cpu(),
		si.mem(),
		si.fsSize(),
		si.currentLoad(),
	]);
	return NextResponse.json({
		cpu,
		memory,
		disk,
		currentLoad,
	});
}