import { NextRequest, NextResponse } from "next/server";

export async function GET(Request: Request) {
    return new NextResponse("Hello, Next.js!");
}