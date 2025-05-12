export interface DiskInfo {
  fs: string;
  type: string;
  size: number;
  used: number;
  mount: string;
}

export interface DiskFormatted {
  name: string;
  type: string;
  size: number;
  fsused: number;
  "fsuse%"?: string;
  children?: DiskFormatted[];
}

export type ByteUnit = "B" | "K" | "M" | "G" | "T";