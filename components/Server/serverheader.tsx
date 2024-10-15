"use client"

import { ServerWithMemberswithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown, PlusCircle, Settings, Trash, UserPlus2, Users } from "lucide-react";
import { useModel } from "@/hooks/use-modal-store";
  

interface ServerHeaderprops{
    server:ServerWithMemberswithProfiles;
    role:MemberRole;
}
const ServerHeader = ({server,role}:ServerHeaderprops) => {
    const isAdmin=role==MemberRole.ADMIN;
    const isModerator=role==MemberRole.MODERATOR||isAdmin;
    const {onOpen}=useModel();
    return ( 
        <div className="flex items-centre w-full h-10">
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button className="w-full text-md font-semibold px-3 flex items-center h-12
                    border-neutral-100 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                    dark:hover:bg-zinc-700/50 transition z-40">
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto"/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {isAdmin && <DropdownMenuItem onClick={()=>{onOpen("invite",{server:server})}}>
                        <div className="flex flex-row items-center w-full">
                            <p>Invite People</p>
                            <div className="ml-auto"><UserPlus2/></div>
                        </div>
                    </DropdownMenuItem>}
                    {isAdmin  && <DropdownMenuItem onClick={()=>{onOpen("editServer",{server:server})}}>
                        <div className="flex flex-row items-center w-full">
                            <p>Server Settings</p>
                            <div className="ml-auto"><Settings/></div>
                        </div>
                    </DropdownMenuItem>}
                    {isAdmin  && <DropdownMenuItem onClick={()=>{onOpen("manageMembers",{server:server})}}>
                        <div className="flex flex-row items-center w-full">
                            <p>Manage Members</p>
                            <div className="ml-auto"><Users/></div>
                        </div>
                    </DropdownMenuItem>}
                    {isAdmin  && <DropdownMenuItem onClick={()=>{onOpen("createChannel",{server:server})}}>
                        <div className="flex flex-row items-center w-full">
                            <p>Create Channel</p>
                            <div className="ml-auto"><PlusCircle/></div>
                        </div>
                    </DropdownMenuItem>}
                    {isAdmin  && <DropdownMenuItem onClick={()=>{onOpen("deleteServer",{server:server})}}>
                        <div className="flex flex-row items-center w-full">
                            <p>Delete server</p>
                            <div className="ml-auto"><Trash/></div>
                        </div>
                    </DropdownMenuItem>}
                    {!isAdmin  && <DropdownMenuItem onClick={()=>{onOpen("leaveServer",{server:server})}}>
                        <div className="flex flex-row items-center w-full">
                            <p>Leave Server</p>
                            <div className="ml-auto"><Trash/></div>
                        </div>
                    </DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>
        </div> 
    );
}
 
export default ServerHeader;