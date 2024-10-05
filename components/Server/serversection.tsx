"use client"
import { useModel } from "@/hooks/use-modal-store";
import { ServerWithMemberswithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { Plus, Settings } from "lucide-react";

interface ServersectionProps{
    label:string,
    channelType?:string,
    memberRole?:string,
    role?:string,
    sectionType?:"channels" | "members"
    server:ServerWithMemberswithProfiles
}
const ServerSection = ({
    label,channelType,memberRole,role,sectionType,server
}:ServersectionProps) => {
    const {onOpen}=useModel();
    return ( 
        <div className="flex items-center justify-between py-2">
                <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                    {label} CHANNELS</p>
                {role!=MemberRole.GUEST && sectionType=="channels" &&(
                    <Plus onClick={()=>{onOpen("createChannel",{server:server})}} 
                    className="mr-4 w-4 h-4 hover:text-slate-200"/>
                )}
                {sectionType=="members" && (
                    <Settings className="mr-4 w-4 h-4 hover:text-slate-200" onClick={()=>{onOpen("manageMembers",{server:server})}}/>
                )}
                
        </div>
     );
}
 
export default ServerSection;