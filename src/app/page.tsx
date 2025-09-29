"use client";

import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage } from "react-konva";
import BackgroundComponent from "./components/BackgroundComponent";
import ForegroundComponent from "./components/ForegroundComponent";

const WIDTH = 5000;
const HEIGHT = 5000;
const CELL_SIZE = 40;

function snapToGrid(x: number, y: number, cell: number) {
  return {
    x: Math.round(x / cell) * cell,
    y: Math.round(y / cell) * cell,
  };
}

export default function Home() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [snapPos, setSnapPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStageMouseMove = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const p = stage.getPointerPosition();
    if (!p) return;

    const transform = stage.getAbsoluteTransform().copy().invert();
    const world = transform.point(p);

    setSnapPos(snapToGrid(world.x, world.y, CELL_SIZE));
  };


  return (
    <Stage
      ref={stageRef}
      width={viewport.width}
      height={viewport.height}
      draggable
      onMouseMove={handleStageMouseMove}
      onDragMove={handleStageMouseMove}
    >
      <BackgroundComponent width={WIDTH} height={HEIGHT} cellSize={CELL_SIZE} />
      <ForegroundComponent x={snapPos.x} y={snapPos.y} />
    </Stage>
  );
}