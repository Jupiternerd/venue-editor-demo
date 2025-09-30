import { Line } from "react-konva";
import { PlaceableProps } from "./Placeable";

export type WallPlaceableProps = PlaceableProps & Readonly<{
x1: number;
y1: number;
x2: number;
y2: number;
}>;

export default function WallPlaceable({x1, y1, x2, y2, id}: WallPlaceableProps) {
    return (
        <Line id={id} points={[x1, y1, x2, y2]} stroke={"white"} strokeWidth={4} 
  hitStrokeWidth={50}/>
    )
}