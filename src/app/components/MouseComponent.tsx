"use client";

import {
	useEffect,
	useState,
	useContext,
	useCallback,
	useRef,
	useMemo,
} from "react";
import { Circle, Layer, Line } from "react-konva";
import { useCurrentTool } from "../contexts/CurrentTool";
import { Stage } from "konva/lib/Stage";
import { WallPlaceableProps } from "./placeable/Wall";
import Konva from "konva";
import { DoorPlaceableProps } from "./placeable/Door";
import { TablePlaceableProps } from "./placeable/Table";
import { PlaceableTypesArr } from "./placeable/Placeable";

type MouseComponentProps = Readonly<{
	mousePosRef: React.RefObject<{ x: number; y: number }>;
	stageRef: React.RefObject<Stage | null>;
	gridWidth: number;
	gridHeight: number;
	cellSize: number;
	placeables: PlaceableTypesArr;
	setPlaceables: React.Dispatch<React.SetStateAction<PlaceableTypesArr>>;
}>;

const ToolColorMap: Record<string, string> = {
	wall: "white",
	table: "blue",
	wall_2: "white",
	door: "green",
	delete: "red",
};

function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max);
}
function snapToGrid(
	x: number,
	y: number,
	cell: number,
	width: number,
	height: number
) {
	return {
		x: clamp(Math.round(x / cell) * cell, 0, width),
		y: clamp(Math.round(y / cell) * cell, 0, height),
	};
}

export default function MouseComponent({
	mousePosRef,
	stageRef,
	gridHeight,
	gridWidth,
	placeables,
	setPlaceables,
	cellSize,
}: MouseComponentProps) {
	const rafRef = useRef<number | null>(null);
	const { tool, setTool } = useCurrentTool();
	const [snapPos, setSnapPos] = useState({ x: 0, y: 0 });
	const nearestPlaceable = useRef<Konva.Node | null>(null);

	const updateSnapFromPointer = useCallback(() => {
		const stage = stageRef.current;
		if (!stage) return;

		const p = stage.getPointerPosition();
		if (!p) return;

		const pR = stage.getRelativePointerPosition();
		if (!pR) return;

		nearestPlaceable.current = stage.getIntersection(p);

		const snapped = snapToGrid(pR.x, pR.y, cellSize, gridWidth, gridHeight);

		setSnapPos((prev) =>
			prev.x === snapped.x && prev.y === snapped.y ? prev : snapped
		);
	}, [cellSize, gridWidth, gridHeight]);

	const handlePointer = useCallback(() => {
		if (rafRef.current != null) return;
		if (!stageRef.current) return;

		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			updateSnapFromPointer();
		});
	}, [updateSnapFromPointer, snapPos]);

	useEffect(() => {
		return () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	const handleStageClick = useCallback(() => {
		switch (tool.type) {
			case "wall": {
				// prev wall_2 logic
				if (tool.data?.vertices) {
					const start = tool.data?.vertices[0] ?? snapPos;

					if (start === snapPos) {
						setTool({ type: "wall", data: {} });
						break;
					}

					const newWall: WallPlaceableProps = {
						type: "wall",
						id: `wall-${placeables.length + 1}-${Date.now()}`,
						x1: start.x,
						y1: start.y,
						x2: snapPos.x,
						y2: snapPos.y,
					};
					setPlaceables((prev) => [...prev, newWall]); // could be optimized
					setTool({ type: "wall", data: {} });
					break;
				}
				setTool({
					type: "wall",
					data: { vertices: [snapPos] },
				});
				break;
			}
			case "door": {
				// door is a single line just like wall

				if (!tool.data?.vertices) {
					// if no start, set start
					setTool({
						type: "door",
						data: { vertices: [snapPos] },
					});
					break;
				}

				const newdoor: DoorPlaceableProps = {
					type: "door",
					id: `door-${placeables.length + 1}-${Date.now()}`,
					x1: tool.data?.vertices[0]?.x || snapPos.x,
					y1: tool.data?.vertices[0]?.y || snapPos.y,
					x2: snapPos.x,
					y2: snapPos.y,
				};
				setPlaceables((prev) => [...prev, newdoor]); // could be optimized
				setTool({ type: "door", data: {} });
				break;
			}
			case "delete": {
				if (nearestPlaceable) {
					const node = nearestPlaceable.current;
					if (node) {
						const id = node.id();
						setPlaceables((prev) =>
							prev.filter((p) => p.id !== id)
						);
					}
				}
				break;
			}
			case "table": {
				// table can be a n-gon, but cannot intersect with walls or doors
				// has to be atleast 3 verts and closed
				if (!tool.data?.vertices) {
					// if no start, set start
					setTool({
						type: "table",
						data: { vertices: [snapPos] },
					});
					break;
				}

				const verts = tool.data?.vertices || [];

				// if snapPos is same as last vert, remove it
				if (verts.length > 0) {
					const lastVert = verts[verts.length - 1];
					if (lastVert.x === snapPos.x && lastVert.y === snapPos.y) {
						setTool({
							type: "table",
							data: { vertices: verts.slice(0, -1) },
						});
						break;
					}
				}

				// if first vert == snapPos and atleast 3 verts, then close the table
				if (
					verts.length >= 3 &&
					verts[0].x === snapPos.x &&
					verts[0].y === snapPos.y
				) {
					const newTable = {
						type: "table",
						id: `table-${placeables.length + 1}-${Date.now()}`,
						vertices: verts,
					} as TablePlaceableProps;
					// add table
					setPlaceables((prev) => [...prev, newTable]);
					// reset tool
					setTool({ type: "table", data: {} });
					break;
				}
				// add vert
				setTool({
					type: "table",
					data: { vertices: [...verts, snapPos] },
				});
				break;
			}

			default:
				break;
		}
	}, [tool, setTool, snapPos, placeables, setPlaceables]);

	useEffect(() => {
		mousePosRef.current = snapPos;
	}, [snapPos, mousePosRef]);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;

		stage.on("mousemove", handlePointer);
		stage.on("dragmove", handlePointer);
		stage.on("click", handleStageClick);
		return () => {
			stage.off("mousemove", handlePointer);
			stage.off("dragmove", handlePointer);
			stage.off("click", handleStageClick);
		};
	}, [handlePointer, handleStageClick, stageRef]);

	return (
		<Layer listening={false}>
			<Circle
				x={snapPos.x}
				y={snapPos.y}
				radius={5}
				fill={ToolColorMap[tool.type]}
			/>
			{["wall", "table", "door"].includes(tool.type) &&
				tool.data?.vertices &&
				tool.data?.vertices.map((v, i) => {
					// points should be 
					// if the i % 2 === 0, then draw line from v to v+1
					if (i + 1 < tool.data!.vertices!.length) {
						const v2 = tool.data!.vertices![i + 1];
						return (
							<Line
								key={i}
								points={[v.x, v.y, v2.x, v2.y]}
								stroke={ToolColorMap[tool.type]}
								strokeWidth={2}
							/>
						);
					}
					if (
						i === tool.data!.vertices!.length - 1
					) {
						return (
							<Line
								key={i}
								points={[v.x, v.y, snapPos.x, snapPos.y]}
								stroke={ToolColorMap[tool.type]}
								strokeWidth={2}
							/>
						);
					}

				})}
			{["wall", "table", "door"].includes(tool.type) &&
				tool.data?.vertices && (
				<Circle
					x={snapPos.x}
					y={snapPos.y}
					radius={15}
					strokeWidth={2}
					stroke={ToolColorMap[tool.type]}
					fill={"transparent"}
				/>)}
		</Layer>
	);
}
