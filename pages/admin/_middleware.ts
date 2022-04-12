import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import {getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, event: NextFetchEvent) {



  const session: any = await getToken({req,secret: process.env.NEXTAUTH_SECRET} as any)
  const {origin,pathname} = req.nextUrl.clone()
  if(!session){
    const {origin,pathname} = req.nextUrl.clone()
    return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
  }
  const validRoles = ["admin","super-user", "SEO"];

  if(!validRoles.includes(session.user.role)){
 
    return NextResponse.redirect(`${origin}/`);
  }

  return NextResponse.next();

}
