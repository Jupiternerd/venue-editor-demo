"use client";

import { useCurrentTool } from "@/app/contexts/CurrentTool";
import { VendorSchema } from "@/app/lib/server/types";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { redirect, RedirectType } from "next/navigation";

export default function SelectedTableComponent() {
	const { tool } = useCurrentTool();

	const queryClient = useQueryClient();
	const [selTable, setSelTable] = useState<string | null>(null);

	const cachedVendor = queryClient
		.getQueryData<VendorSchema[]>(["vendors"])
		?.find((v) => v.id === selTable);
	useEffect(() => {
		setSelTable(
			tool.type === "selected" && tool.data?.selectedId
				? tool.data.selectedId
				: null
		);
	}, [tool, setSelTable]);

	const vendor = useQuery<VendorSchema>({
		enabled: !!selTable,
		queryKey: ["vendors", selTable],
		queryFn: async () => {
			const res = await fetch(`/api/vendors/${selTable}`);
			if (!res.ok) throw new Error("Failed to load vendors");
			return res.json();
		},
		// so if we already have the vendors list, we can get the data from there
		initialData: cachedVendor,
		// 1 hour, data is ALWAYS static
		staleTime: 1000 * 60 * 60 * 1,
	});

	useEffect(() => {
		if (vendor.isError) toast.error("Failed to load vendor");
	}, [vendor.isError]);

	if (!selTable) return null;
	if (vendor.isLoading || !vendor.data) return null;

	return (
		<Card className={"m-5 bg-amber-50 shadow-sm"}>
			<CardContent>
				<Image
					src={vendor.data.logoUrl || "/placeholder.png"}
					alt={vendor.data.name}
					onClick={() => {
						redirect(`${vendor.data.websiteUrl}`);
					}}
					width={100}
					height={100}
					className={
						"object-contain rounded-xl hover:cursor-pointer hover:scale-105 transition-all"
					}
				/>
				<CardDescription className={"text-black text-lg px-2 py-2"}>
					{vendor.data.name}
				</CardDescription>
				<CardDescription className={"text-black text-sm px-2 py-0"}>
					{vendor.data.description}
                    {vendor.data.tags && vendor.data.tags.length > 0 && (
                        <div className={"mt-2"}>
                            {vendor.data.tags.map((tag) => (
                                <Badge key={tag} className={"mr-2 bg-amber-200"}>{tag}</Badge>
                            ))}
                        </div>
                    )}  
				</CardDescription>
			</CardContent>
		</Card>
	);
}
