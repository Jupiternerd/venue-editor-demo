import { NextRequest, NextResponse } from "next/server";

export async function PATCH(Request: Request) {
    console.log(await Request.json());
    return new NextResponse("Hello, Next.js!");
}

export async function GET(Request: Request) {
    return new NextResponse("Hello, Next.js!");
}