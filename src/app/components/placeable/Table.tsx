import { Line } from "react-konva";
import { PlaceableProps } from "./Placeable";

export type TablePlaceableProps = PlaceableProps &
    Readonly<{
        vertices: { x: number; y: number }[];
    }>;

export default function TablePlaceable({
    vertices,
    id
}: TablePlaceableProps) {
    return (
        <Line id={id} points={
            vertices.flatMap((v) => [v.x, v.y])
        }  stroke={"blue"} strokeWidth={2}
        fill={"blue"} opacity={0.3}
  hitStrokeWidth={50} closed/>
    );
}
