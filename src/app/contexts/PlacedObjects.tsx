"use client";
import { createContext, useContext, useEffect, useState } from "react";
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("placedObjects");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setArr(parsed);
                }
            } catch (e) {
                console.error("Failed to parse placedObjects from localStorage", e);
            }
        } else {
            // init with Test_Javits_Center.json
            fetch("/Test_Javits_Center.json")
                .then(res => res.json())
                .then(json => {
                    if (Array.isArray(json)) {
                        setArr(json);
                    }
                })
                .catch(err => {
                    console.error("Failed to load initial placedObjects", err);
                });
        }
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("placedObjects", JSON.stringify(arr));
        }
    }, [arr]);
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