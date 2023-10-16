import {staticFile} from 'remotion';
import {getVideoMetadata, VideoMetadata} from '@remotion/media-utils';
import {ThreeCanvas, useVideoTexture} from '@remotion/three';
import React, {useEffect, useRef, useState} from 'react';
import {useVideoConfig, Video} from 'remotion';
import {Phone} from './Phone';

const videoStyle: React.CSSProperties = {
	position: 'absolute',
	opacity: 0,
};

export const Scene: React.FC = () => {
	const phoneColor = 'rgba(110, 152, 191, 0.00)';
	const baseScale = 1;

	const videoRef = useRef<HTMLVideoElement>(null);
	const {width, height} = useVideoConfig();
	const [videoData, setVideoData] = useState<VideoMetadata | null>(null);

	const videoSrc = staticFile('1.mov');

	useEffect(() => {
		getVideoMetadata(videoSrc)
			.then((data) => setVideoData(data))
			.catch((err) => console.log(err));
	}, [videoSrc]);

	const texture = useVideoTexture(videoRef);
	return (
		<div className="bg-transparent w-3/4 absolute h-3/4 -right-60 bottom-0">
			<Video ref={videoRef} src={videoSrc} style={videoStyle} />
			{videoData ? (
				<ThreeCanvas linear width={(width * 3) / 4} height={(height * 3) / 4}>
					<ambientLight intensity={1.5} color={0xffffff} />
					<pointLight position={[10, 10, 0]} />
					<Phone
						phoneColor={phoneColor}
						baseScale={baseScale}
						videoTexture={texture}
						aspectRatio={videoData.aspectRatio}
					/>
				</ThreeCanvas>
			) : null}
		</div>
	);
};
