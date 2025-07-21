import bcrypt from "bcrypt";
const password = process.argv[2];

if (!password) {
	console.error(
		"Invalid argument, please follow this format: node generatePasswordHash <password>");
	process.exit(1);
}

try {
	const hash = await bcrypt.hash(password, 12);
	console.log("Generated bcrypt hash:");
	console.log(hash);
	console.log("Paste it in the .env file - ADMIN_PASSWORD_HASH.");
} catch (error) {
	console.error("Error generating hash:", error);
	process.exit(1);
}
