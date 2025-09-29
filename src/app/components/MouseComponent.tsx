"use client";

import { useEffect, useState, useContext } from "react";
import { Circle, Layer } from "react-konva";
import { useCurrentTool } from "../contexts/CurrentTool";


type MouseComponentProps = Readonly<{
	x: number;
	y: number;
}>;

const ToolColorMap: Record<string, string> = {
    wall: "white",
    table: "blue",
    wall_2: "white",
    spawn: "green",
    delete: "red"
}

export default function MouseComponent({
	x,
	y
}: MouseComponentProps) {
    const { tool } = useCurrentTool();

	return (
		<Layer>
			<Circle x={x} y={y} radius={5} fill={ToolColorMap[tool.type]} />
		</Layer>
	);
}
