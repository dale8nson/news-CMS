import { NextRequest, NextResponse } from "next/server"
import { useAppDispatch } from "@/lib/hooks"

export const POST = async (req: NextRequest ) => {
  const id = crypto.randomUUID();
  
}