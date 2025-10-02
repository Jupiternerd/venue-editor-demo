"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { VendorSchema } from "../lib/server/types";
import { useCurrentTool } from "../contexts/CurrentTool";
import { Button } from "@/components/ui/button";
export default function VendorSelectionScreen() {
	const { setTool } = useCurrentTool();
	const vendorsQuery = useQuery({
		queryKey: ["vendors"],
		queryFn: async () => {
			const res = await fetch("/api/vendors");
			if (!res.ok) throw new Error("Failed to load vendors");
			return res.json();
		},
		// 1 hour, data is ALWAYS static
		staleTime: 1000 * 60 * 60 * 1,
	});

	if (vendorsQuery.isLoading) return;
	if (vendorsQuery.isError) {
		toast.error("Failed to load vendors");
	}
	return (
		<div className="absolute top-4 left-4 p-4">
			<Card className={"bg-black/50"}>
				<CardContent>
					<div className={"grid-cols-2 gap-4 grid"}>
						{(vendorsQuery.data as VendorSchema[]).map((vendor) => (
							<div
								key={vendor.id}
								className={"flex flex-col items-center"}
							>
								<Image
									src={vendor.logoUrl || "/placeholder.png"}
									alt={vendor.name}
									width={100}
									height={100}
									className={
										"object-contain rounded-xl hover:cursor-pointer hover:scale-105 transition-all"
									}
									onClick={() => {
										setTool({
											type: "selected",
											data: { selectedId: vendor.id },
										});
									}}
								/>
							</div>
						))}

						<Button onClick={
                            () => setTool({ type: "selected", data: {} })
                        }>Select None</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
