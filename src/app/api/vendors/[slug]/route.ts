import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/server/drivers/supaBase";
export async function GET(Request: Request, context: { params: Promise<{ slug: string }> }) {
    let params = await context.params 
    const slug = params.slug;
    const supabase = await createClient(
    );
    const { data, error } = await supabase.from('Vendors').select("*").eq('id', slug).single();
    if (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new NextResponse(JSON.stringify(data), { status: 200 });
}