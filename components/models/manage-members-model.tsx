"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {useRouter } from "next/navigation";
import { useModel } from "@/hooks/use-modal-store";
import { ServerWithMemberswithProfiles } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import UserAvator from "../ui/useravatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import qs from "query-string";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuSub,
  } from "@/components/ui/dropdown-menu"
import { Member, MemberRole } from "@prisma/client";
import axios from "axios";
const roleIconMap={
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="h-4 w-4 ml-2 text-indigo-100"/>,
    "ADMIN":<ShieldAlert className="h-4 w-4 text-rose-500"/>
}
const ManageMemberModel = () => {
    const {onOpen,isOpen,onClose, type, data}=useModel();
    const [LoadingId,setLoadingId]=useState<string>();
    const ismodelopen=isOpen  && type=="manageMembers";
    const router=useRouter();
    const handleClose=()=>{
        onClose();
    }
    const {server}= data as {server:ServerWithMemberswithProfiles};
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`;
    const onKick=async(memberId:string)=>{
        try{
            setLoadingId(memberId);
            const url=qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id,
                }
            })
            const response=await axios.delete(url);
            router.refresh();
            onOpen("manageMembers",{server:response.data})
        }catch(error){
            console.log(error);
        }finally{
            setLoadingId("");
        }
    };
    const onRoleChange=async(memberId:string,role:MemberRole)=>{
        try{
            setLoadingId(memberId);
            const url=qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id,
                }
            })
            const response=await axios.patch(url,{role});
            router.refresh();
            onOpen("manageMembers",{server:response.data})
        }catch(error){
            console.log(error);
        }finally{
            setLoadingId("");
        }
    }
    return ( 
        <>
            <Dialog open={ismodelopen} onOpenChange={handleClose}>
                <DialogTrigger></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle> Manage members</DialogTitle>
                        <DialogDescription>
                            <div className="flex-col">
                                {server?.members?.length} Members
                            </div>
                        </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="mt-8 max-h-[420px] pr-6">
                            {server?.members?.map((member)=>(
                                <div key={member.id} className="flex items-centre
                                gap-x-2 mb-6">
                                    <UserAvator src={member.profile.imageUrl}/>
                                    <div className="flex flex-col">
                                        <div>
                                            {member.profile.name}
                                            {roleIconMap[member.role]}
                                        </div>
                                        <p>
                                            {member.profile.email}
                                        </p>
                                    </div>
                                    {server.profileId != member.profileId &&
                                    LoadingId!=member.id && (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-4 w-4"/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger
                                                        className="flex items-center">
                                                            <ShieldQuestion className="h-4 w-4 mr-2"/>
                                                            <span>Role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem 
                                                            onClick={()=>onRoleChange(member.id,"GUEST")}>
                                                                <Shield className="h-4 w-4 mr-4"/>
                                                                Guest
                                                                {member.role==="GUEST" && (
                                                                    <Check/>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                            onClick={()=>onRoleChange(member.id,"MODERATOR")}>
                                                                <ShieldCheck className="h-4 w-4 mr-4"/>
                                                                Moderator
                                                                {member.role==="MODERATOR" && (
                                                                    <Check/>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={()=>onKick(member.id)}>
                                                        <Gavel className="h-4 w-4 mr-2"/>
                                                        Kick
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                    {LoadingId===member.id && (
                                                <Loader2 className="animate-spin ml-auto h-4 w-4"/>
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
        </>
     );
}
 
export default ManageMemberModel;