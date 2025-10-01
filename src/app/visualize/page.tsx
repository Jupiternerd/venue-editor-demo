"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { usePlacedObjects } from "../contexts/PlacedObjects";
import { convertBGToThreeBG, translateCoordsToThree } from "../lib/HelperUtils";
import { HEIGHT, THREE_WALL_HEIGHT, THREE_WALL_THICKNESS, WIDTH } from "../lib/Constants";
import { start } from "repl";
import * as THREE from "three";

export default function Home() {
	const { arr } = usePlacedObjects();

	const [THREE_FLOOR_X, THREE_FLOOR_Z] = useMemo(() => {
		return convertBGToThreeBG(WIDTH, HEIGHT);
	}, [WIDTH, HEIGHT]);

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<Canvas
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: "white",
				}}
			>
				<axesHelper scale={10} />
				<PerspectiveCamera
					makeDefault
					position={[30, 45, 30]}
					zoom={0.1}
					fov={5}
				/>
				<OrbitControls
					target={[0, 0, 0]}
					enablePan
					enableRotate
					keyPanSpeed={50}
				/>

				<ambientLight intensity={0.5} color={"white"} />
				<directionalLight position={[-15, 6, 20]} intensity={1} />

				{arr.map((obj, index) => {
					switch (obj.type) {
						case "wall": {
							const [x1, y1] = translateCoordsToThree(
								obj.x1,
								obj.y1
							);
							const [x2, y2] = translateCoordsToThree(
								obj.x2,
								obj.y2
							);

							const start = new THREE.Vector3(x1, 0, y1);
							const end = new THREE.Vector3(x2, 0, y2);
							// find mid point
							const mid = start
								.clone()
								.add(end)
								.multiplyScalar(0.5);
							const direction = end.clone().sub(start);
							const length = direction.length();

							const theta = Math.atan2(direction.z, direction.x);

							return (
								<mesh
									key={index}
									position={[mid.x, 1.5, mid.z]}
									rotation={[0, -theta, 0]}
								>
									<boxGeometry args={[length, THREE_WALL_HEIGHT, THREE_WALL_THICKNESS]} />
									<meshStandardMaterial color={"orange"} />
								</mesh>
							);
						}
						default:
							return null;
					}
				})}

				<Grid
					args={[THREE_FLOOR_X, THREE_FLOOR_Z]}
					cellSize={1}
					cellThickness={1}
					infiniteGrid={false}
					cellColor={"black"}
					sectionColor={"black"}
				/>
			</Canvas>
		</div>
	);
}
