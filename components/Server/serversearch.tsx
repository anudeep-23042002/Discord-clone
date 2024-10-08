"use client"

import { Search } from "lucide-react"
import { useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

interface ServersearchProps{
    data:{
        label:string,
        type:"channel" | "member",
        data:{
            Icon:React.ReactNode,
            name:string,
            id:string
        }[] | undefined
    }[]
}
const ServerSearch = ({data}:ServersearchProps) => {
    const [open,setopen]=useState(false);
    const router=useRouter();
    const params=useParams();
    const onClick=({id,type}:{id:string,type:"channel" | "member"})=>{
        setopen(false);
        if(type=="member"){
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }
        if(type=="channel"){
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    }
    return ( 
        <div className="border p-2">
            <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full 
            hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition" onClick={()=>{setopen(true)}}>
                <Search className="mr-2 w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
                <p>
                    Search
                </p>
            </button>
            <CommandDialog open={open} onOpenChange={setopen}>
                <CommandInput placeholder="Search all channel and members"></CommandInput>
                <CommandList>
                    <CommandEmpty>No Results Found</CommandEmpty>
                    {data.map(({label,type,data})=>{
                        if(!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({id,Icon,name})=>{
                                    return (
                                        <CommandItem onSelect={()=>onClick({id,type})} key={id}>
                                            {Icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </div>
     );
}
 
export default ServerSearch;