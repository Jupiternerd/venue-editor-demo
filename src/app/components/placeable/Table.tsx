import { Line } from "react-konva";
import { PlaceableProps } from "./Placeable";

export type TablePlaceableProps = PlaceableProps &
	Readonly<{
        type: "table";
		vertices: { x: number; y: number }[];
		assignedVendorId?: string;
	}>;

export default function TablePlaceable({ vertices, id, assignedVendorId }: TablePlaceableProps) {
	return (
		<Line
			id={id}
			points={vertices.flatMap((v) => [v.x, v.y])}
			stroke={assignedVendorId ? "blue" : "red"}
			strokeWidth={3}
			fill={"green"}
			opacity={0.3}
			hitStrokeWidth={50}
			closed
		/>
	);
}
