import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwt } from "../../utils";
import {getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // const { token = "" } = req.cookies;

  // try {
  //   await jwt.isValidToken(token);
  //   return NextResponse.next();
  // } catch (error) {
  //   const {origin,pathname} = req.nextUrl.clone()
  //   return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
  // }


  const session = await getToken({req,secret: process.env.NEXTAUTH_SECRET} as any)

  if(!session){
    const {origin,pathname} = req.nextUrl.clone()
    return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
  }

  return NextResponse.next();

}
