"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useCurrentTool } from "../contexts/CurrentTool";
import { usePlacedObjects } from "../contexts/PlacedObjects";

export default function UILayer() {
    const { setTool } = useCurrentTool();
	const {setArr} = usePlacedObjects();
	return (
		<Card className="absolute bottom-40 right-5 w-48 p-0.5 bg-black/30 backdrop-blur-1xl border border-none">
			<CardHeader className="p-2">Tool</CardHeader>
			<CardContent className="p-0 flex flex-col gap-1">
				<div className="grid grid-cols-2 gap-1">
					<button
						className="bg-white/20 hover:bg-white/30 text-white rounded p-1 text-sm"
						onClick={() => {
							setTool({type: "wall", data: {}});
						}}
					>
						Wall
					</button>
					<button
						className="bg-white/20 hover:bg-white/30 text-white rounded p-1 text-sm"
						onClick={() => {
							setTool({type: "table", data: {}});
						}}
					>
						Table
					</button>
					<button
						className="bg-white/20 hover:bg-white/30 text-white rounded p-1 text-sm"
						onClick={() => {
							setTool({type: "door", data: {}});
						}}
					>
						door
					</button>
                                        <button
                        className="bg-white/20 hover:bg-white/30 text-red-500 rounded p-1 text-sm"
                        onClick={() => {
							setTool({type: "delete", data: {}});
                        }}
                    >
                        Delete
                    </button>
					<button
                        className="bg-white/20 hover:bg-white/30 text-red-500 rounded p-1 text-sm"
                        onClick={() => {
							setArr([]);
                        }}
                    >
                        Delete ALL
                    </button>
					
				</div>
			</CardContent>
		</Card>
	);
}
