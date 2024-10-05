"use client"
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import UserAvator from "../ui/useravatar";
import { cn } from "@/lib/utils";
import { MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface Servermemberprops{
    name:string,
    id:string,
    role:MemberRole,
}
const roleIconMap={
    [MemberRole.GUEST]:null,
    [MemberRole.MODERATOR]:<ShieldCheck className="h-4 w-4 ml-2 text-zinc-400"/>,
    [MemberRole.ADMIN]:<ShieldAlert className="h-4 w-4 ml-2 text-zinc-400"/>
};
const ServerMember = ({name,id,role}:Servermemberprops) => {
    const router=useRouter();
    const params=useParams();
    const onClick=()=>{
        router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
    const icon=roleIconMap[role];
    return ( 
        <button className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-slate-700/50",
            params?.memberId===id && "bg-zinc-700/20 dark:bg-zinc-700" 
        )} onClick={onClick}>
                {icon}
                <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.memberId===id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}>{name}</p>
            
        </button>
     );
}
 
export default ServerMember;