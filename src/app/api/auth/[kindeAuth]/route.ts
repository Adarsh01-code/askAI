
// Original code
// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest, NextResponse } from "next/server";



// export async function GET(request: NextRequest,{params}:any) {
//     const endpoint = params.kindeAuth;
//     return handleAuth(request,endpoint);
// }



// Try code
// src/pages/api/auth/[kindeAuth].ts
// Adjust the path as necessary to fit within the pages/api directory structure

import { NextApiRequest, NextApiResponse } from 'next';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

// This is the correct way to structure your API route handler
export default async function(req: NextApiRequest, res: NextApiResponse) {
    const { kindeAuth } = req.query;

    try {
        // Your logic here, for example, using handleAuth with kindeAuth
        // This is a placeholder; adjust according to how handleAuth is intended to be used
        const result = await handleAuth(req, kindeAuth as string);
        
        // Assuming handleAuth returns something you can directly send as a response
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Not Found' });
        }
    } catch (error) {
        console.error('Error in handleAuth:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}







