module.exports = {
	apps: [
		{
			name: "sys-monitor-app",
			script: "node_modules/next/dist/bin/next",
			args: "start",
			instances: 1,
			autorestart: true,
			watch: false,
			exec_mode: "fork",
			env: {
				NODE_ENV: "production",
			},
			log_date_format: "YYYY-MM-DD HH:mm:ss",
		},
		{
			name: "settings-watcher",
			script: "node_modules/tsx/dist/cli.cjs",
			args: "settingsMonitor.js",
			instances: 1,
			autorestart: true,
			watch: false,
			exec_mode: "fork",
			log_date_format: "YYYY-MM-DD HH:mm:ss",
		},
	],
};