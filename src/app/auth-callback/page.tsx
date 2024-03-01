
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client"
import { Loader2 } from "lucide-react"
import { TRPCClientError } from '@trpc/client';
import { Suspense } from "react";


type AuthCallbackResponse = {
    success: boolean;
}

const Page =  () => {
    const router = useRouter()
    // const searchParams = useSearchParams()
    const searchParams = new URLSearchParams(window.location.search);
    const origin = searchParams.get('origin')
    
    trpc.authCallback.useQuery(undefined, {
        onSuccess : ({success}: AuthCallbackResponse) => {
            if(success) {
                router.push(origin ? `/${origin}` : '/dashboard')
            }
        },
        
        onError : (err) => {
            if(err.data?.code === "UNAUTHORIZED") {
                router.push('/sign-in')
            }
        },

        retry : true,
        retryDelay : 1000
                
        
    })

    return (
        
            <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-800"/>
                <h3 className="font-semibold text-xl">Setting up your account ...</h3>
                <p>You will be redirected automatically</p>
            </div>
        </div>
        
        
    )
    
}

export default Page



// "use client"

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { trpc } from '../_trpc/client';
// import { Loader2 } from 'lucide-react';
// import { TRPCClientError } from '@trpc/client';

// type AuthCallbackResponse = {
//     success: boolean;
// };

// const Page = () => {
//     const router = useRouter();
//     const [isClient, setIsClient] = useState(false);

    
//     useEffect(() => {
//         setIsClient(true);
//     }, []);

    
//     useEffect(() => {
//         if (!isClient) return;

        
//         const searchParams = new URLSearchParams(window.location.search);
//         const origin = searchParams.get('origin');

//         trpc.authCallback.useQuery(undefined, {
//             onSuccess: ({ success }: AuthCallbackResponse) => {
//                 if (success) {
//                     router.push(origin ? `/${origin}` : '/dashboard');
//                 }
//             },

//             onError: (err) => {
//                 if (err.data?.code === "UNAUTHORIZED") {
//                     router.push('/sign-in');
//                 }
//             },

//             retry: true,
//             retryDelay: 1000,
//         });
//     }, [isClient, router]);

//     return (
//         <div className="w-full mt-24 flex justify-center">
//             <div className="flex flex-col items-center gap-2">
//                 <Loader2 className="h-8 w-8 animate-spin text-zinc-800"/>
//                 <h3 className="font-semibold text-xl">Setting up your account...</h3>
//                 <p>You will be redirected automatically</p>
//             </div>
//         </div>
//     );
// };

// export default Page;
