export function extractMemoryFromURL(url: string): string | undefined {
	const regex = /mem(.*?)-/;
	const match = url.match(regex);
	return match ? match[1] : undefined;
}

export function extractMemoryInGiFromURL(url: string): number {
	const memString = extractMemoryFromURL(url);

	if (memString) {
		// Determine the unit (Mi or Gi)
		const unit = memString.slice(-2);
		const value = parseFloat(memString.slice(0, -2));

		switch (unit) {
			case 'Mi':
				// Convert Mi to Gi (1 Gi = 1024 Mi)
				return value / 1024;
			case 'Gi':
				return value;
			default:
				throw new Error("Invalid unit. Expected 'Mi' or 'Gi'.");
		}
	}

	throw new Error('Unable to extract memory from URL.');
}
