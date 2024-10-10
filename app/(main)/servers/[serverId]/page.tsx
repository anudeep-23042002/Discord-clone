import { db } from "@/lib/db";
import initialprofile from "@/lib/initialprofile";
import { redirect } from "next/navigation";

interface ServerpageProps{
    params:{
        serverId:string
    }
}

const Serverpage = async({params}:ServerpageProps) => {
    const profile= await initialprofile();
    if(!profile){
        return redirect("/");
    }
    console.log("/CHANNELS/KKKKK",params.serverId)
    const channel=await db.channel.findFirst({
        where:{
            serverId:params.serverId,
            name:"general"
        }
    });
    if(channel){
      return redirect(`/servers/${params.serverId}/channels/${channel.id}`);
    }
    return redirect(`/servers/${params.serverId}`);
}
 
export default Serverpage;