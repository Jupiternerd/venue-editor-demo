"use client";
import { createContext, useContext, useState } from "react";

type Tool = {
    type: "wall" | "table" | "door" | "delete";
    data?: {
		vertices?: { x: number; y: number }[];
    }
}

const CurrentToolContext = createContext<{
	tool: Tool;
	setTool: (tool: Tool) => void;
} | null>(null);

export function CurrentToolProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [tool, setTool] = useState<Tool>({ type: "wall", data: {} });
	return (
		<CurrentToolContext.Provider value={{ tool, setTool }}>
			{children}
		</CurrentToolContext.Provider>
	);
}

export function useCurrentTool() {
	const ctx = useContext(CurrentToolContext);
	if (!ctx)
		throw new Error(
			"useCurrentTool must be used inside CurrentToolProvider"
		);
	return ctx;
}
