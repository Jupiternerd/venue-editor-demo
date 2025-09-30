import { DoorPlaceableProps } from "./Door";
import { TablePlaceableProps } from "./Table";
import { WallPlaceableProps } from "./Wall";

export type PlaceableProps = Readonly<{
    id: string;
    type: "wall" | "table" | "door";
}>;

export type PlaceableTypesArr = Array<
    WallPlaceableProps | DoorPlaceableProps | TablePlaceableProps
    // should prob use an actual data structure here intead of passing in prop types
    >