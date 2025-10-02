"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useCurrentTool } from "../contexts/CurrentTool";
import { usePlacedObjects } from "../contexts/PlacedObjects";
import { Button } from "@/components/ui/button";
import { useCallback, useRef } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { redirect, RedirectType } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function UILayer() {
	const { setTool } = useCurrentTool();
	const { setArr, arr } = usePlacedObjects();
	const fileInputRef = useRef<HTMLInputElement | null>(null);


	const loadJSONFile = useCallback(() => {
		const e = fileInputRef.current;
		if (!e?.files?.[0]) {
			alert("err No file selected");
			return;
		}
		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = e.target?.result;
			// basic validation
			if (typeof text === "string") {
				try {
					const parsed = JSON.parse(text);
					if (Array.isArray(parsed)) {
						setArr(parsed);
					} else {
						alert("Invalid JSON format: not an array");
					}
				} catch (err) {
					alert("Failed to parse JSON file");
				}
			}
		};
		reader.readAsText(e?.files[0]);
	}, [setArr]);

	return (
		<Card className="absolute bottom-4/10 right-1/20 min-w-fit p-3 backdrop-blur-1xl border border-none bg-white/10 rounded-2xl">
			<CardContent className="p-1 m-1 flex flex-col">
				<div className="grid grid-cols-1 gap-2">
					<Button
						variant={"default"}
						onClick={() => {
							setTool({ type: "wall", data: {} });
						}}
					>
						Wall
					</Button>
					<Button
						variant={"default"}
						onClick={() => {
							setTool({ type: "table", data: {} });
						}}
					>
						Table
					</Button>
					<Button
						variant={"default"}
						onClick={() => {
							setTool({ type: "door", data: {} });
						}}
					>
						door
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							setTool({ type: "delete", data: {} });
						}}
					>
						Delete
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Clear All</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure you want to clear
									all?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This will delete all placed objects
									including walls, tables, and doors. This
									action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										setArr([]);
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button>Import JSON</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Input id={"JSON_import"} type={"file"} ref={fileInputRef}/>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										loadJSONFile();
									}}
								>
									Import
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Button
						onClick={() => {
							const dataStr =
								"data:text/json;charset=utf-8," +
								encodeURIComponent(JSON.stringify(arr));
							const dlAnchorElem = document.createElement("a");
							dlAnchorElem.setAttribute("href", dataStr);
							dlAnchorElem.setAttribute("download", "scene.json");
							dlAnchorElem.click();
						}}
					>
						Export JSON
					</Button>
					<Button
						className={"bg-green-400"}
						onClick={() => {
							redirect("/visualize", RedirectType.push);
						}}
					>
						3D Visualize
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
