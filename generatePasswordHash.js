import bcrypt from "bcrypt";
const password = process.argv[2].trim();

if (!password) {
	console.error(
		"Invalid argument, please follow this format: node generatePasswordHash <password>");
	process.exit(1);
}

try {
	const hash = await bcrypt.hash(password, 12);
	const base64Hash = Buffer.from(hash).toString("base64");
	console.log("Copy the following line EXACTLY and paste it into your .env file:");
	console.log(`"${base64Hash}"`);
	console.log("Paste it in the .env file - ADMIN_PASSWORD_HASH.");
} catch (error) {
	console.error("Error generating hash:", error);
	process.exit(1);
}
