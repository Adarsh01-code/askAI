// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest,{params}:any) {
//     const endpoint = params.kindeAuth;
//     return handleAuth(request,endpoint);
// }

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
    const endpoint = params.kindeAuth;

    // Await the handleAuth promise and then handle the response
    try {
        // Await the result of handleAuth
        const response = await handleAuth(request, endpoint);

        // Assuming handleAuth correctly handles the request and returns a NextResponse
        // You can directly return the response if it's not null or undefined
        if (response) {
            return response;
        } else {
            // If handleAuth does not return a response, you can return a generic error or a 404
            return new NextResponse("Not Found", { status: 404 });
        }
    } catch (error) {
        // In case of errors, return a server error response
        console.error("Error handling auth:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}






