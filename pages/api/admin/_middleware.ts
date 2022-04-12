import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import {getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, event: NextFetchEvent) {



  const session: any = await getToken({req,secret: process.env.NEXTAUTH_SECRET} as any)

  if(!session){
   
    return new Response(JSON.stringify({
      message: "No autorizado",
    }),{
      status: 401,
    })
  }
  const validRoles = ["admin","super-user", "SEO"];

  if(!validRoles.includes(session.user.role)){
 
    return new Response(JSON.stringify({
      message: "No autorizado",
    }),{
      status: 401,
    })
  }

  return NextResponse.next();

}
