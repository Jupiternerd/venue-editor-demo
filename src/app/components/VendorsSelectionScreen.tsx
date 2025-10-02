"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner"
export default function VendorSelectionScreen() {
	const vendorsQuery = useQuery({
		queryKey: ["vendors"],
		queryFn: async () => {
			const res = await fetch("/api/vendorsaa");
			if (!res.ok) throw new Error("Failed to load vendors");
			return res.json();
		},
        // 1 hour, data is ALWAYS static
		staleTime: 1000 * 60 * 60 * 1,
	});

    if (vendorsQuery.isLoading) return <div>Loading...</div>;
    if (vendorsQuery.isError) return toast("Error loading vendors");
	return <div>VendorSelectionScreen</div>;
}
