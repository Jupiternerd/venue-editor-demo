"use client";

import { useMemo } from "react";
import { Line, Layer } from "react-konva";

type BackgroundComponentProps = Readonly<{
    ref: React.RefObject<any>;
	width: number;
	height: number;
	cellSize: number;
}>;

export default function BackgroundComponent({
    ref,
	width,
	height,
	cellSize,
}: BackgroundComponentProps) {
	const lines = useMemo(() => {
		const arr: { points: number[] }[] = [];
		for (let x = 0; x <= width; x += cellSize) {
			arr.push({ points: [x, 0, x, height] });
		}
		for (let y = 0; y <= height; y += cellSize) {
			arr.push({ points: [0, y, width, y] });
		}
		return arr;
	}, [width, height, cellSize]);

	return (
		<Layer ref={ref}>
			{lines.map((line, i) => (
				<Line
					key={i}
					points={line.points}
					stroke="#9C9C9C"
					opacity={0.2}
					strokeWidth={1}
				/>
			))}
		</Layer>
	);
}
