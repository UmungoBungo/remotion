import {memo, useCallback, useContext, useMemo} from 'react';
import '../../../../styles/editor-guides.css';
import {EditorShowGuidesContext} from '../../state/editor-guides';
import {RULER_WIDTH} from '../../state/editor-rulers';

const Guide: React.FC<{
	guideDetails: {
		position: number;
		orientation: 'horizontal' | 'vertical';
	};
	index: number;
	canvasDimensions: {
		left: number;
		top: number;
		width: number;
		height: number;
	};
	scale: number;
}> = ({guideDetails, index, canvasDimensions, scale}) => {
	const {shouldCreateGuideRef, setSelectedGuideIndex} = useContext(
		EditorShowGuidesContext,
	);
	const isVerticalGuide = guideDetails.orientation === 'vertical';

	const guideStyle: React.CSSProperties = useMemo(() => {
		const canvasPosition = isVerticalGuide
			? canvasDimensions.left
			: canvasDimensions.top;
		const guidePosition = guideDetails.position * scale + canvasPosition;
		return {
			position: 'absolute',
			width: `${isVerticalGuide ? '1px' : '100%'}`,
			height: `${isVerticalGuide ? '100%' : '1px'}`,
			left: `${isVerticalGuide ? guidePosition : 0}px`,
			top: `${isVerticalGuide ? 0 : guidePosition}px`,
			cursor: `${isVerticalGuide ? 'ew-resize' : 'ns-resize'}`,
			padding: isVerticalGuide ? '0 2px' : '2px 0',
			zIndex: 1000,
		};
	}, [guideDetails, scale, canvasDimensions, isVerticalGuide]);

	const guideContentStyle: React.CSSProperties = useMemo(() => {
		return {
			position: 'relative',
			minWidth: `${isVerticalGuide ? '1px' : `calc(100% + ${RULER_WIDTH}px`}`,
			minHeight: `${isVerticalGuide ? `calc(100% + ${RULER_WIDTH}px` : '1px'}`,
			top: `${isVerticalGuide ? `-${RULER_WIDTH}px` : '0px'}`,
			left: `${isVerticalGuide ? '0px' : `-${RULER_WIDTH}px`}`,
		};
	}, [isVerticalGuide]);

	const onMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.preventDefault();
			shouldCreateGuideRef.current = true;
			document.body.style.cursor = 'no-drop';
			setSelectedGuideIndex(() => index);
		},
		[shouldCreateGuideRef, setSelectedGuideIndex, index],
	);

	return (
		<div style={guideStyle} onMouseDown={onMouseDown} className="editor-guide">
			<div style={guideContentStyle} className="editor-guide-content" />
		</div>
	);
};

export default memo(Guide);
