import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import SelectedTableComponent from "./SelectedTable";

export default function ThreeDUI() {
    const router = useRouter()
	return (
		<>
			<div className={"text-black z-0 absolute top-0 right-0"}>
				<Button
					className={"m-5"}
					variant={"secondary"}
					onClick={() => router.push("/")}
				>
					Exit 3D Visualization
				</Button>
			</div>

			<div className={"text-black z-0 absolute top-0 left-0"}>
				<Card className={"m-5 bg-amber-50 shadow-sm"}>
					<CardDescription className={"text-black text-sm px-4 py-0"}>
						<ul className={"list-disc pl-6"}>
							<li>Left mouse button to rotate, scroll to zoom and right mouse to pan.</li>
							<li>
								Hover over tables to see the vendor information if assigned.
							</li>
							<li>
								Exit by clicking the button on the top right.
							</li>
						</ul>
					</CardDescription>
				</Card>
                <SelectedTableComponent/>
			</div>
		</>
	);
}
