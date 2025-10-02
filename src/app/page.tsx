"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import Konva from "konva";
import { Stage } from "react-konva";
import BackgroundComponent from "./components/BackgroundComponent";
import MouseComponent from "./components/MouseComponent";
import ForegroundComponent from "./components/ForegroundComponent";
import UILayer from "./components/MapUI";
import { CELL_SIZE, HEIGHT, WIDTH } from "./lib/Constants";
import VendorSelectionScreen from "./components/VendorsSelectionScreen";


export default function Home() {
	const [viewport, setViewport] = useState({ width: 0, height: 0 });
	const snapPos = useRef({ x: 0, y: 0 }); // incase we need it
	const stageRef = useRef<Konva.Stage | null>(null);

	useEffect(() => {
		const handleResize = () => {
			setViewport({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const stageSize = useMemo(
		() => ({ width: viewport.width, height: viewport.height }),
		[viewport.width, viewport.height]
	);

	return (
		<>
			<Stage
				ref={stageRef}
				width={stageSize.width}
				height={stageSize.height}
				draggable
			>
				<BackgroundComponent
					width={WIDTH}
					height={HEIGHT}
					cellSize={CELL_SIZE}
				/>
				<ForegroundComponent />
				<MouseComponent
					mousePosRef={snapPos}
					stageRef={stageRef}
					gridHeight={HEIGHT}
					gridWidth={WIDTH}
					cellSize={CELL_SIZE}
				/>
			</Stage>
			<VendorSelectionScreen/>
			<UILayer />
		</>
	);
}
