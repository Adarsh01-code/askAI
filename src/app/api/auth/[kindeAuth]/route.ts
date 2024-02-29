// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest, NextResponse } from "next/server";



// export async function GET(request: NextRequest,{params}:any) {
//     const endpoint = params.kindeAuth;
//     return handleAuth(request,endpoint);
// }



// API Route example
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
export default async function handler(req:any, res:any) {
    const endpoint = req.query.kindeAuth;

    try {
        const result =  handleAuth(req, endpoint);
        if (result) {
            // Directly send a response if handleAuth returns something usable
            res.status(200).json(result);
        } else {
            // Or handle cases where handleAuth doesn't return what you expect
            res.status(404).send('Not Found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}







