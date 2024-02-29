// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest,{params}:any) {
//     const endpoint = params.kindeAuth;
//     return handleAuth(request,endpoint);
// }






import { NextApiRequest, NextApiResponse } from 'next';

function handleAuthRoute(req: NextApiRequest, res: NextApiResponse) {

  res.status(200).json({ message: 'Auth route response' });
}


export default handleAuthRoute;


