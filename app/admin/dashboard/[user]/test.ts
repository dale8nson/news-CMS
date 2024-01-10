import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export const GET = async (req: NextRequest, params: { user: string }) => {
  const user = params.user;
  console.log(`params:`, params);
  try {
    return NextResponse.redirect(new URL(`/admin/${user}/dashboard`, req.url));
  } catch (e) {
    console.error(new Error(e));
  }
}


export const dynamic = 'force-dynamic';