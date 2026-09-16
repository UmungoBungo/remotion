/* eslint-disable @typescript-eslint/no-use-before-define */
import type {DelayRenderScope} from 'remotion';
import type {BackgroundKeepalive} from './background-keepalive';
import type {OnRenderReady} from './delay-render-scope';
import type {InternalState} from './internal-state';
import {withResolvers} from './with-resolvers';

export const waitForReady = ({
	timeoutInMilliseconds,
	scope,
	onRenderReady,
	signal,
	apiName,
	internalState,
	keepalive,
}: {
	timeoutInMilliseconds: number;
	scope: DelayRenderScope;
	onRenderReady: OnRenderReady;
	signal: AbortSignal | null;
	apiName: 'renderMediaOnWeb' | 'renderStillOnWeb';
	internalState: InternalState | null;
	keepalive: BackgroundKeepalive | null;
}) => {
	const start = performance.now();
	const {promise, resolve, reject} = withResolvers<void>();

	let settled = false;

	const settle = () => {
		settled = true;
		unsubscribe();
		internalState?.addWaitForReadyTime(performance.now() - start);
	};

	const check = () => {
		if (settled) {
			return;
		}

		if (signal?.aborted) {
			settle();
			reject(new Error(`${apiName}() was cancelled`));
			return;
		}

		if (scope.remotion_renderReady === true) {
			settle();
			resolve();
			return;
		}

		if (scope.remotion_cancelledError !== undefined) {
			settle();
			const stack = scope.remotion_cancelledError;
			const message = stack.split('\n')[0].replace(/^Error: /, '');
			const error = new Error(message);
			error.stack = stack;
			reject(error);
			return;
		}

		if (performance.now() - start > timeoutInMilliseconds + 3000) {
			settle();
			reject(
				new Error(
					Object.values(scope.remotion_delayRenderTimeouts)
						.map((d) => d.label)
						.join(', '),
				),
			);
			return;
		}

		scheduleNextCheck();
	};

	// continueRender() flips the flag; re-check one microtask later so that a
	// delayRender() issued in the same synchronous run (a sibling effect in the
	// same commit) is already registered, as a later poll would have seen it.
	const unsubscribe = onRenderReady(() => {
		queueMicrotask(check);
	});

	// The animation frame / worker tick stays as the fallback for the abort
	// signal, cancelRender() and the timeout, none of which flip the flag.
	// Both are scheduled and whichever fires first wins: when the tab is
	// visible, rAF fires first; when it is backgrounded, the worker wins.
	const scheduleNextCheck = () => {
		const rafTick = new Promise<void>((res) => {
			requestAnimationFrame(() => res());
		});

		// browsers throttle RAF when tab is backgrounded, so race against worker
		const backgroundSafeTick = keepalive
			? Promise.race([rafTick, keepalive.waitForTick()])
			: rafTick;

		backgroundSafeTick.then(check);
	};

	// check immediately first - if already ready, don't wait for RAF
	check();

	return promise;
};
