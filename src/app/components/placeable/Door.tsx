import { Line } from "react-konva";
import { PlaceableProps } from "./Placeable";

export type DoorPlaceableProps = PlaceableProps &
	Readonly<{
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}>;

export default function SpawnPlaceable({
	x1,
	y1,
	x2,
	y2,
	id,
}: DoorPlaceableProps) {
	return (
		<Line
			id={id}
			points={[x1, y1, x2, y2]}
			stroke={"green"}
			strokeWidth={3}
			hitStrokeWidth={50}
		/>
	);
}
