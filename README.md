# System Monitor (A Next.js & TypeScript Project)

**Please Note:** This is a personal learning project and is currently in an early state. It is a work in progress as I explore Next.js, TypeScript, and system monitoring.

## Description
A cross-platform system monitoring application built with Next.js and TypeScript. It provides a real-time look into system statistics like CPU load, memory usage, disk space, and network activity.

## Key Features
* **Real-time Monitoring:** View live updates for System Load, Memory, Disk, and Network usage.
* **System Information:** A dedicated tab to view key computer hardware and OS stats.
* **Historical Data:** Retrieve past statistics and visualise them on a graph.
* **Settings:** Configure monitoring intervals and the duration for which stats are kept.

## Target Platforms
* Windows
* Linux
* Docker

## Technologies Used
* **Framework:** Next.js
* **Language:** TypeScript & JavaScript
* **Styling:** Tailwind CSS

## How to Run
1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install dependencies: `npm install`
4.  In a separate terminal, start the backend statistics collector: `npm run watch`
5.  Start the development server: `npm run dev`

## How to run on Docker
**Please note: A `Dockerfile` has not been implemented for this project yet.** The commands below outline the planned process for building and running the container once the `Dockerfile` is complete.

1.  Build the Docker image:
    `sudo docker build -t sysmonitor .`
2.  Run the container:
    `sudo docker run -d --name sysmonitor --network=host -v /:/host:ro -v /dev:/dev:ro sysmonitor`
    *Note: `network=host` is required to detect accurate network usage. The volume mounts (`/` and `/dev`) are required for accurate metrics of memory, CPU, and disk space. Not including these will lead to unexpected behaviour.*
3.  Once the container is created, run the following command to install necessary disk utilities:
    `sudo docker exec -it sysmonitor sh -c "apk update && apk add util-linux && lsblk"`
    *Note: This is required because the application uses the `lsblk` command to retrieve disk information.*
