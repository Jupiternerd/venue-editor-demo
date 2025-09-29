"use client";

import { useEffect, useState } from "react";
import { Circle, Layer } from "react-konva";

type ForegroundComponentProps = Readonly<{
	x: number;
	y: number;
    type?: 'table' | 'wall';
    del?: boolean;
}>;

export default function ForegroundComponent({
	x,
	y,
    del,
    type = 'wall'
}: ForegroundComponentProps) {

	return (
		<Layer>
			<Circle x={x} y={y} radius={5} fill={type == "wall" ? "white" : "blue"} />
		</Layer>
	);
}
