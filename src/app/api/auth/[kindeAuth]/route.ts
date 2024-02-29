
// Original code
// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest, NextResponse } from "next/server";



// export async function GET(request: NextRequest,{params}:any) {
//     const endpoint = params.kindeAuth;
//     return handleAuth(request,endpoint);
// }



// Try code
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
export default async function GET(req:any, res:any) {
    const endpoint = req.query.kindeAuth;

    try {
        const result =  handleAuth(req, endpoint);
        if (result) {
            
            res.status(200).json(result);
        } else {
            
            res.status(404).send('Not Found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}







