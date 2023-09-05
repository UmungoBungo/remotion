import {startLongRunningCompositor} from './compositor/compositor';
import type {VideoMetadata} from './compositor/payloads';
import type {LogLevel} from './log-level';

export const getVideoMetadata = async (
	videoSource: string,
	options?: {logLevel?: LogLevel},
): Promise<VideoMetadata> => {
	const compositor = startLongRunningCompositor({
		maximumFrameCacheItemsInBytes: null,
		logLevel: options?.logLevel ?? 'info',
		indent: false,
	});
	const metadataResponse = await compositor.executeCommand('GetVideoMetadata', {
		src: videoSource,
	});
	compositor.finishCommands();
	await compositor.waitForDone();
	return JSON.parse(metadataResponse.toString('utf-8')) as VideoMetadata;
};
