export function extractCpuFromURL(url: string): number {
	const regex = /cpu(.*?)-/;
	const match = url.match(regex);

	if (!match) {
		throw new Error('Unable to extract cpu from URL.');
	}

	return Number(match[1]);
}
