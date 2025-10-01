import { CELL_SIZE, HEIGHT, WIDTH } from "./Constants";

export function convertBGToThreeBG(x: number, y: number): [number, number] {
	// grid component takes cells as 1 unit
	// mid point
	return [x / CELL_SIZE, y / CELL_SIZE];
}

export function translateCoordsToThree(x: number, y: number): [number, number] {
	// threejs coords are centered at 0,0 but our bg coords are top left at 0, 0
    console.log("input coords: ", x, y);
	return [
        x / CELL_SIZE - WIDTH / (2 * CELL_SIZE),
        (y / CELL_SIZE - HEIGHT / (2 * CELL_SIZE)),
	];
}

export function getLengthOfLine(
	x1: number,
	y1: number,
	x2: number,
	y2: number
): number {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
