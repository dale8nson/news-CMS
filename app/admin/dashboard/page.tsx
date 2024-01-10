import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const Page = ({params}) => {

  console.log(`dashboard params:`, params);
  return (
    <></>
  )
}

export default Page;

export const GET = async (req: NextRequest, params: { user: string }) => {
  const user = params.user;
  console.log(`params:`, params);
  try {
    return NextResponse.redirect(new URL(`/admin/${user}/dashboard`, req.url));
  } catch (e) {
    console.error(new Error(e));
  }
}