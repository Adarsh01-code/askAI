import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

const Page = () => {
    const {getUser} = getKindeServerSession()
    const user = getUser()

    // if(!user || !user.id)
    if(!user) redirect('/auth-callback?origin=dashboard')
 
    return (
        <div>hello</div>
    )
}

export default Page

