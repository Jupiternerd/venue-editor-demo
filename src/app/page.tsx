"use client";

import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage } from "react-konva";
import BackgroundComponent from "./components/BackgroundComponent";
import ForegroundComponent from "./components/ForegroundComponent";

const WIDTH = 1700;
const HEIGHT = 1700;
const CELL_SIZE = 50;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
function snapToGrid(x: number, y: number, cell: number) {
  return {
    x: clamp(Math.round(x / cell) * cell, 0, WIDTH),
    y: clamp(Math.round(y / cell) * cell, 0, HEIGHT)
  };
}

export default function Home() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [snapPos, setSnapPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage | null>(null);
  const bgRef = useRef<Konva.Layer | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStageMouseMove = () => {
    // dragging/mouse move
    const stage = stageRef.current;
    if (!stage) return;

    const p = stage.getPointerPosition();
    if (!p) return;

    const transform = stage.getAbsoluteTransform().copy().invert();
    const world = transform.point(p);

    setSnapPos(snapToGrid(world.x, world.y, CELL_SIZE));

    // for recentering the view if bg is out of view
    /*
    const bg = bgRef.current;
    if (!bg) return;
    const box = bg.getClientRect();
    if (
      box.x > 0 ||
      box.y > 0 ||
      box.x + box.width < stage.width() ||
      box.y + box.height < stage.height()
    ) {
      console.log("recentering");
    }
      */
     // runs every mouse move. will move it to drag move only to reduce calls.


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
      <BackgroundComponent ref={bgRef} width={WIDTH} height={HEIGHT} cellSize={CELL_SIZE} />
      <ForegroundComponent x={snapPos.x} y={snapPos.y} type={"table"}/>
    </Stage>
  );
}