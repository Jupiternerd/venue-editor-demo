import { useMemo } from "react";
import WallPlaceable, { WallPlaceableProps } from "./placeable/Wall";
import { Group, Layer } from "react-konva";
import DoorPlaceable, { DoorPlaceableProps } from "./placeable/Door";
import TablePlaceable, { TablePlaceableProps } from "./placeable/Table";
import { PlaceableTypesArr } from "./placeable/Placeable";
import { usePlacedObjects } from "../contexts/PlacedObjects";

type ForegroundComponentProps = Readonly<{
}>;

export default function ForegroundComponent({
}: ForegroundComponentProps) {
    const {arr} = usePlacedObjects();
	return (
		<Layer>
			<Group name="placeable">
				{arr.map((p) => {
                    switch (p.type) {
                        // p is also props so we can spread it 
                        // (maybe storing it as props wasnt so bad afterall) [it is]
                        case "wall":
                            return <WallPlaceable key={p.id} {...(p as WallPlaceableProps)} />;
                        case "door":
                            return <DoorPlaceable key={p.id} {...(p as DoorPlaceableProps)} />;
                        case "table":
                            return <TablePlaceable key={p.id} {...(p as TablePlaceableProps)} />;
                        default:
                            return null;
                    }
                })}
			</Group>
		</Layer>
	);
}
