"use client";
import { createContext, useContext, useState } from "react";
import {PlaceableTypesArr} from "../components/placeable/Placeable"

type PlacedObjectsContextType = {
    arr: PlaceableTypesArr,
    setArr: (arr: PlaceableTypesArr) => void,
}

const PlacedObjectsContext = createContext<PlacedObjectsContextType | null>(null);

export function PlacedObjectsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [arr, setArr] = useState<PlaceableTypesArr>([]);
    return (
        <PlacedObjectsContext.Provider value={{ arr, setArr }}>
            {children}
        </PlacedObjectsContext.Provider>
    );
}

export function usePlacedObjects() {
    const ctx = useContext(PlacedObjectsContext);
    if (!ctx)
        throw new Error(
            "usePlacedObjects must be used inside usePlacedObjectsProvider"
        );
    return ctx;
}