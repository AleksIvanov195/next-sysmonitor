export async function waitForUnlock(lockRef: () => boolean): Promise<void> {
	if (!lockRef()) return;
	await new Promise<void>(resolve => {
		const check = () => {
			if (!lockRef()) resolve();
			else setTimeout(check, 50);
		};
		check();
	});
}