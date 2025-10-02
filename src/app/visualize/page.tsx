"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import { MouseEvent, Ref, useEffect, useMemo, useRef, useState } from "react";
import { usePlacedObjects } from "../contexts/PlacedObjects";
import { convertBGToThreeBG, translateCoordsToThree } from "../lib/HelperUtils";
import {
	HEIGHT,
	THREE_TABLE_HEIGHT,
	THREE_WALL_HEIGHT,
	THREE_WALL_THICKNESS,
	WIDTH,
} from "../lib/Constants";
import { start } from "repl";
import * as THREE from "three";
import ThreeDUI from "../components/visualize/3DUI";
import { useCurrentTool } from "../contexts/CurrentTool";
import VendorSelectionScreen from "../components/VendorsSelectionScreen";

function getRotPosAngLen(x1: number, y1: number, x2: number, y2: number) {
	const start = new THREE.Vector3(x1, 0, y1);
	const end = new THREE.Vector3(x2, 0, y2);
	// find mid point
	const mid = start.clone().add(end).multiplyScalar(0.5);
	const direction = end.clone().sub(start);
	const length = direction.length();

	const theta = Math.atan2(direction.z, direction.x);

	return { mid, theta, length };
}

export default function Home() {
	const { arr } = usePlacedObjects();
	const {setTool} = useCurrentTool();

	const [THREE_FLOOR_X, THREE_FLOOR_Z] = useMemo(() => {
		return convertBGToThreeBG(WIDTH, HEIGHT);
	}, [WIDTH, HEIGHT]);

	useEffect(() => {
		console.log("mounted");
	}, [])

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
				<group
					onPointerEnter={(e) => {
						// set mouse to pointer
						document.body.style.cursor = "pointer";
						e.stopPropagation();
						// mchanges material to indicate hover
						const data = e.object.userData as
							| {
									type: string;
									id: string;
									assignedVendorId?: string;
							  }
						if (data.type === "table" && data.assignedVendorId) {
							(e.object as THREE.Mesh).material =
								new THREE.MeshStandardMaterial({
									color: "blue",
								});
						}
					}}
					onPointerLeave={(e) => {
						// reset mouse
						document.body.style.cursor = "default";
						e.stopPropagation();
						// revert material
						const data = e.object.userData as {
							type: string;
							id: string;
							assignedVendorId?: string;
						};
						if (data.type === "table" && data.assignedVendorId) {
							(e.object as THREE.Mesh).material =
								new THREE.MeshStandardMaterial({
									color: "green",
								});
						}
					}}
					onClick={(e) => {
						e.stopPropagation();
						const data = e.object.userData as
							| {
									type: string;
									id: string;
									assignedVendorId?: string;
							  }
						if (data?.type === "table") {
							console.log("clicked table", data);
							setTool({ type: "selected", data: { selectedId: data.assignedVendorId } });
						}
					}}
				>
					{arr.map((obj) => {
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

								const { mid, theta, length } = getRotPosAngLen(
									x1,
									y1,
									x2,
									y2
								);

								return (
									<mesh
										key={obj.id}
										userData={{ type: "wall", id: obj.id }}
										position={[mid.x, 1.5, mid.z]}
										rotation={[0, -theta, 0]}
									>
										<boxGeometry
											args={[
												length,
												THREE_WALL_HEIGHT,
												THREE_WALL_THICKNESS,
											]}
										/>
										<meshStandardMaterial
											color={"orange"}
										/>
									</mesh>
								);
							}
							case "table": {
								// table is a bit complicated, it has >= 3 vertices
								// check if its valid first as a precaution
								if (obj.vertices.length < 3) return null;
								const verts3 = obj.vertices.map((v) => {
									const [x, z] = translateCoordsToThree(
										v.x,
										v.y
									);
									return new THREE.Vector3(x, 0, z);
								});

								// shape takes in points in a flat plane
								const shape = new THREE.Shape(
									verts3.map(
										(v) => new THREE.Vector2(v.x, v.z)
									)
								);

								const geometry = new THREE.ExtrudeGeometry(
									shape,
									{
										steps: 1,
										depth: THREE_TABLE_HEIGHT,
										bevelEnabled: false,
									}
								);
								geometry.rotateX(Math.PI / 2); // was vertical, make horizontal

								return (
									<mesh
										key={obj.id}
										userData={{
											type: "table",
											id: obj.id,
											assignedVendorId:
												obj.assignedVendorId,
										}}
										geometry={geometry}
										position={[0, 1, 0]}
									>
										<meshStandardMaterial
											color={
												obj.assignedVendorId
													? "green"
													: "red"
											}
										/>
									</mesh>
								);
							}
							case "door": {
								const [x1, y1] = translateCoordsToThree(
									obj.x1,
									obj.y1
								);
								const [x2, y2] = translateCoordsToThree(
									obj.x2,
									obj.y2
								);

								const { mid, theta, length } = getRotPosAngLen(
									x1,
									y1,
									x2,
									y2
								);

								return (
									<mesh
										key={obj.id}
										position={[mid.x, 0.15, mid.z]}
										userData={{ type: "wall", id: obj.id }}
										rotation={[0, -theta, 0]}
									>
										<boxGeometry
											args={[length, 0.3, 0.5]}
										/>
										<meshStandardMaterial color={"blue"} />
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
				</group>
			</Canvas>
			<ThreeDUI />
		</div>
	);
}
