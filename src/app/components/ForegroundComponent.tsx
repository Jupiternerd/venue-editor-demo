import { useMemo } from "react";
import WallPlaceable, { WallPlaceableProps } from "./placeable/Wall";
import { Layer } from "react-konva";


type ForegroundComponentProps = Readonly<{
    placeables: WallPlaceableProps[];
}>;

export default function ForegroundComponent({
    placeables
}: ForegroundComponentProps) {
    return (
        <Layer>
        {placeables.map((p) => (
            <WallPlaceable key={p.id} id={p.id} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} />
        ))}
        </Layer>
    );
}