"use client"
import { useModel } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { ServerWithMemberswithProfiles } from "@/types";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
  
interface Serverchannelprops{
    name:string,
    id:string
    server:ServerWithMemberswithProfiles
    channel:Channel
}
const IconMap={[ChannelType.TEXT]:Hash,
    [ChannelType.AUDIO]:Mic,
    [ChannelType.VIDEO]:Video
};
const ServerChannel = ({name,id,server,channel}:Serverchannelprops) => {
    const {onOpen}=useModel();
    const router=useRouter();
    const params=useParams();
    const onClick=()=>{
        router.push(`/servers/${params?.serverId}/channels/${channel?.id}`);
    }
    const Icon=IconMap[channel.type];
    return ( 
        <button className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-slate-700/50",
            params?.channelId===channel.id && "bg-zinc-700/20 dark:bg-zinc-700" 
        )} onClick={onClick}>
                <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"/>
                <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId===channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}>{name}</p>
                {/* role!==MemberRole.GUEST && */}
                {channel.name!=="general" &&  
                    (<div className="flex items-center ml-auto gap-x-2">
                    <Edit className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400" onClick={()=>{onOpen("editChannel",{server:server,channel:channel})}}/>
                    <Trash className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400"onClick={()=>{onOpen("deleteChannel",{server:server,channel:channel})}}/>
                </div>)}
                {channel.name==="general" && (
                    <Lock className="ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400"/>
                )}
        </button>
     );
}
 
export default ServerChannel;