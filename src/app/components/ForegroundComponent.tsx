"use client";

import { Circle, Layer } from "react-konva";

type ForegroundComponentProps = Readonly<{
	x: number;
	y: number;
}>;

export default function ForegroundComponent({
	x,
	y,
}: ForegroundComponentProps) {
	return (
		<Layer>
			<Circle x={x} y={y} radius={5} fill="white" />
		</Layer>
	);
}
