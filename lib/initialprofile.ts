import { currentUser} from "@clerk/nextjs/server";
import {db} from "../lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";

const initialprofile = async() => {
    const user =await currentUser();
    if(!user){
        RedirectToSignIn({redirectUrl:"/signin"});
    }
    const profile=await db.profile.findUnique({
        where :{
            userId:user?.id
        }
    });
    if(profile){
        return profile;
    }
    const newprofile=db.profile.create({
        data:{
            userId:user?.id,
            name:`${user?.firstName} ${user?.lastName}`,
            imageUrl:user?.imageUrl,
            email:user?.emailAddresses[0].emailAddress
        }
    });
    return newprofile;
}
 
export default initialprofile;