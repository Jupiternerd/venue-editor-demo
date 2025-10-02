import { CELL_SIZE, HEIGHT, WIDTH } from "./Constants";

export function convertBGToThreeBG(x: number, y: number): [number, number] {
	// grid component takes cells as 1 unit
	// mid point
	return [x / CELL_SIZE, y / CELL_SIZE];
}

export function translateCoordsToThree(x: number, y: number): [number, number] {
	// threejs coords are centered at 0,0 but our Konva coords are top left at 0, 0
	return [
        x / CELL_SIZE - WIDTH / (2 * CELL_SIZE),
        (y / CELL_SIZE - HEIGHT / (2 * CELL_SIZE)),
	];
}