import { useCurrentTool } from "@/app/contexts/CurrentTool";
import { useEffect, useState } from "react";

export default function SelectedTableComponent() {
    const {tool} = useCurrentTool();
    const [selTable, setSelTable] = useState<string | null>(null);

    useEffect(() => {
        setSelTable(
            tool.type === "selected" && tool.data?.selectedId ? tool.data.selectedId : null
        )
    }, [tool]);

    return (
        <div>
            Selected Table: {selTable ?? "None"}
        </div>
    );
}