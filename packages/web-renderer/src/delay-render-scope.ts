import type {DelayRenderScope} from 'remotion';

export type OnRenderReady = (listener: () => void) => () => void;

// continueRender() sets `remotion_renderReady` to true once the last
// delayRender() handle is cleared. An accessor lets waitForReady() learn about
// that in the same task instead of polling on the next animation frame, which
// on a 60 Hz display idles for up to one refresh interval per frame.
export const createDelayRenderScope = ({
	delayRenderTimeoutInMilliseconds,
}: {
	delayRenderTimeoutInMilliseconds: number;
}): {scope: DelayRenderScope; onRenderReady: OnRenderReady} => {
	const listeners = new Set<() => void>();
	let renderReady = true;

	const scope: DelayRenderScope = {
		get remotion_renderReady() {
			return renderReady;
		},
		set remotion_renderReady(value: boolean) {
			renderReady = value;
			if (!value) {
				return;
			}

			for (const listener of Array.from(listeners)) {
				listener();
			}
		},
		remotion_delayRenderTimeouts: {},
		remotion_puppeteerTimeout: delayRenderTimeoutInMilliseconds,
		remotion_attempt: 0,
		remotion_delayRenderHandles: [],
	};

	const onRenderReady: OnRenderReady = (listener) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	};

	return {scope, onRenderReady};
};
