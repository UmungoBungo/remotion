import {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import {useDelayRender} from 'remotion';
import {expect, test, vi} from 'vitest';
import {renderMediaOnWeb} from '../render-media-on-web';
import {renderStillOnWeb} from '../render-still-on-web';
import '../symbol-dispose';

const centerPixel = async (blob: Blob) => {
	const bitmap = await createImageBitmap(blob);
	const canvas = document.createElement('canvas');
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(bitmap, 0, 0);
	bitmap.close();
	return Array.from(
		ctx.getImageData(bitmap.width / 2, bitmap.height / 2, 1, 1).data,
	);
};

// Clears its delayRender() handle on a timer, so the composition is never
// ready on the first synchronous check.
const AsyncGreen: React.FC = () => {
	const {delayRender, continueRender} = useDelayRender();
	const [ready, setReady] = useState(false);
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const timeout = setTimeout(() => {
			flushSync(() => {
				setReady(true);
			});
			continueRender(handle);
		}, 20);
		return () => clearTimeout(timeout);
	}, [continueRender, handle]);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: ready ? 'rgb(0, 128, 0)' : 'rgb(255, 0, 0)',
			}}
		/>
	);
};

const composition = {
	component: AsyncGreen,
	width: 64,
	height: 64,
	fps: 30,
	durationInFrames: 3,
};

test('renderStillOnWeb() continues as soon as the last delayRender() handle is cleared, without an animation frame', async () => {
	// Never fire a frame callback: readiness must be observed from
	// continueRender() itself, not from the requestAnimationFrame() fallback.
	const raf = vi
		.spyOn(window, 'requestAnimationFrame')
		.mockImplementation(() => 0);

	try {
		const blob = await (
			await renderStillOnWeb({
				licenseKey: 'free-license',
				composition: {...composition, id: 'wait-for-ready-still'},
				frame: 0,
				inputProps: {},
			})
		).blob({format: 'png'});

		expect(await centerPixel(blob)).toEqual([0, 128, 0, 255]);
	} finally {
		raf.mockRestore();
	}
}, 10_000);

test('renderMediaOnWeb() continues as soon as the last delayRender() handle is cleared, without an animation frame or a worker tick', async (t) => {
	if (t.task.file.projectName === 'webkit') {
		t.skip();
		return;
	}

	const raf = vi
		.spyOn(window, 'requestAnimationFrame')
		.mockImplementation(() => 0);
	// The background keepalive worker ticks at 1000 / fps. Swallowing its
	// "start" message removes that fallback too, while any other worker
	// (mediabunny uses some for alpha video) keeps working.
	const RealWorker = window.Worker;
	// A plain function, not an arrow: the spy is invoked with `new`.
	const worker = vi.spyOn(window, 'Worker').mockImplementation(function (
		url: string | URL,
		options?: WorkerOptions,
	) {
		const real = new RealWorker(url, options);
		const post = real.postMessage.bind(real);
		real.postMessage = ((message: unknown, ...rest: unknown[]) => {
			if (
				typeof message === 'object' &&
				message !== null &&
				(message as {type?: unknown}).type === 'start'
			) {
				return;
			}

			(post as (...args: unknown[]) => void)(message, ...rest);
		}) as Worker['postMessage'];
		return real;
	} as unknown as typeof Worker);

	try {
		const frames: number[][] = [];
		const result = await renderMediaOnWeb({
			licenseKey: 'free-license',
			composition: {...composition, id: 'wait-for-ready-media'},
			inputProps: {},
			onFrame: (frame) => {
				const canvas = document.createElement('canvas');
				canvas.width = frame.displayWidth;
				canvas.height = frame.displayHeight;
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(frame, 0, 0);
				frames.push(
					Array.from(
						ctx.getImageData(
							frame.displayWidth / 2,
							frame.displayHeight / 2,
							1,
							1,
						).data,
					),
				);
				return frame;
			},
		});

		expect((await result.getBlob()).size).toBeGreaterThan(0);
		expect(frames).toHaveLength(composition.durationInFrames);
		for (const pixel of frames) {
			expect(pixel).toEqual([0, 128, 0, 255]);
		}
	} finally {
		worker.mockRestore();
		raf.mockRestore();
	}
}, 10_000);
