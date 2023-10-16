import {AbsoluteFill, staticFile, OffthreadVideo} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PlusJakartaSans';
import {Scene} from './phone/Scene';

const {fontFamily} = loadFont();

const vid1 = staticFile('/1.mov');

export const GpuTesting = () => {
	return (
		<AbsoluteFill className="bg-gradient-to-r from-indigo-950 to-slate-50">
			<h1
				className="absolute bottom-0 right-0 text-7xl font-bold tracking-tight text-default logo-style p-8 bg-white/50 rounded-tl-3xl border-8 border-black"
				style={{
					fontFamily,
				}}
			>
				GPU TESTING
			</h1>
			<div className="w-full flex justify-between items-center py-10 px-4 border-b-8 border-black">
				<div className="flex text-xl">
					<span
						className="mr-10 text-2xl font-extrabold"
						style={{
							fontFamily,
							textShadow: '1px 1px 1px rgba(30,180,100,0.5)',
						}}
					>
						Blur:{' '}
					</span>
					<div className="space-x-4 flex blur-lg">
						<div className="w-8 rounded h-8 bg-orange-500" />
						<div className="w-8 rounded h-8 bg-orange-500" />
						<div className="w-8 rounded h-8 bg-orange-500" />
						<div className="w-8 rounded h-8 bg-orange-500" />
						<div className="w-8 rounded h-8 bg-orange-500" />
					</div>
				</div>
				<div className="flex text-xl">
					<span
						className="mr-10 text-2xl font-extrabold"
						style={{
							fontFamily,
						}}
					>
						Box Shadow:{' '}
					</span>
					<div className="space-x-4 flex">
						<div className="w-8 rounded h-8 bg-black shadow-xl shadow-orange-500" />
						<div className="w-8 rounded h-8 bg-black shadow-xl shadow-orange-500" />
						<div className="w-8 rounded h-8 bg-black shadow-xl shadow-orange-500" />
						<div className="w-8 rounded h-8 bg-black shadow-xl shadow-orange-500" />
						<div className="w-8 rounded h-8 bg-black shadow-xl shadow-orange-500" />
					</div>
				</div>
				<div className="flex text-xl">
					<span
						className="mr-10 text-2xl font-extrabold"
						style={{
							fontFamily,
							textShadow: '4px 4px 2px rgba(18,30,100,0.5)',
						}}
					>
						Drop Shadow:{' '}
					</span>
					<div className="space-x-4 flex">
						<svg
							className="drop-shadow-lg h-8 w-8"
							viewBox="0 0 84 84"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
								fill="#fff"
							/>
						</svg>
						<svg
							className="drop-shadow-lg h-8 w-8"
							viewBox="0 0 84 84"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
								fill="#fff"
							/>
						</svg>
						<svg
							className="drop-shadow-lg h-8 w-8"
							viewBox="0 0 84 84"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
								fill="#fff"
							/>
						</svg>
						<svg
							className="drop-shadow-lg h-8 w-8"
							viewBox="0 0 84 84"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
								fill="#fff"
							/>
						</svg>
						<svg
							className="drop-shadow-lg h-8 w-8"
							viewBox="0 0 84 84"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
								fill="#fff"
							/>
						</svg>
					</div>
				</div>
			</div>
			<OffthreadVideo src={vid1} className="h-full min-w-full object-cover" />
			<Scene />
		</AbsoluteFill>
	);
};
