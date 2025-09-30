import { useMemo } from "react";
import WallPlaceable, { WallPlaceableProps } from "./placeable/Wall";
import { Group, Layer } from "react-konva";
import DoorPlaceable, { DoorPlaceableProps } from "./placeable/Door";
import TablePlaceable, { TablePlaceableProps } from "./placeable/Table";
import { PlaceableTypesArr } from "./placeable/Placeable";

type ForegroundComponentProps = Readonly<{
	placeables: PlaceableTypesArr
}>;

export default function ForegroundComponent({
	placeables,
}: ForegroundComponentProps) {
	return (
		<Layer>
			<Group name="placeable">
				{placeables.map((p) => {
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
