// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest } from "next/server";

// export async function GET(request: NextRequest,{params}:any) {
//     const endpoint = params.kindeAuth;
//     return handleAuth(request,endpoint);
// }

import { NextRequest, NextResponse } from "next/server";


export async function handleAuthAdaptor(request: NextRequest, endpoint: string): Promise<NextResponse> {

  
  return new NextResponse("OK", { status: 200 }); 
}

export async function GET(request: NextRequest, { params }: any): Promise<NextResponse> {
  const endpoint = params.kindeAuth;

  
  return handleAuthAdaptor(request, endpoint);
}

