"use client"
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvator from "../ui/useravatar";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModel } from "@/hooks/use-modal-store";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
const formschema=z.object({
    content:z.string().min(1,{
        message:"Content is required"
    })
})
interface ChatItemProps{
    id:string;
    content:string;
    member:Member & {
        profile:Profile
    }
    timestamp:string;
    fileUrl:string | null;
    deleted:boolean;
    currentMember:Member;
    isUpdated:boolean;
    socketUrl:string;
    socketQuery:Record<string,string>;
}
const roleIconMap={
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="h-4 w-4 ml-2 text-indigo-100"/>,
    "ADMIN":<ShieldAlert className="h-4 w-4 text-rose-500"/>
}
const ChatItem = ({id,content,member,timestamp,fileUrl,deleted,
    currentMember,isUpdated,socketUrl,socketQuery
}:ChatItemProps) => {
    const {onOpen}=useModel();
    const form = useForm({
        resolver:zodResolver(formschema),
        defaultValues:{
            content:"",
        }
    });
    const OnSubmit=async(values: z.infer<typeof formschema>)=>{
        try{
            const url=qs.stringifyUrl({
                url:`${socketUrl}/${id}`,
                query:socketQuery,
            })
            await axios.patch(url,values);
            form.reset();
            setisEditing(false);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        const handleKeyDown=(event:any)=>{
            if(event.key==="Escape" && event.keyCode==27){
                setisEditing(false);
            }
        }
        window.addEventListener("keydown",handleKeyDown);
        return ()=>{
            window.removeEventListener("keydown",handleKeyDown);
        }
    },[]);
    const isLoading=form.formState.isSubmitting;
    useEffect(()=>{
        if(content){
            form.setValue("content",content);
        }
    },[]);
    const [isEditing,setisEditing]=useState(false);
    const [isDeleting,setisDeleting]=useState(false);
    const fileType=fileUrl?.split(".").pop();
    const isAdmin=currentMember.role===MemberRole.ADMIN;
    const isModerator=currentMember.role===MemberRole.MODERATOR;
    const isOwner=currentMember.id===member.id;
    const canDeleteMessage=!deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage=!deleted && isOwner && !fileUrl;
    const isPDF=fileUrl && fileType==="pdf";
    const isImage=!isPDF && fileUrl;
    return ( 
        <div className="relative group flex items-center hover:bg-black/5 p-4 w-full transition">
            <div className="group flex gap-x-2 items-start w-full">
                    <div className="cursor-pointer hover:drop-shadow-md transition">
                        <UserAvator src={member.profile.imageUrl}/>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <p className="font-semibold text-sm hover:underline cursor-pointer">{member.profile.name}</p>
                                {roleIconMap[member.role]}
                            </div>
                            <span className="text-xs text-zinc-500 dark-text-zinc-400">{timestamp}</span>
                            </div>
                            {isImage && (
                                <div>
                                    <a href={fileUrl} 
                                    className="relative aspect-square rounded-md mt-2 overflow-hidden
                                    border flex items-center bg-secondary h-48">
                                        <Image 
                                        src={fileUrl}
                                        alt="content"
                                        loading="eager"
                                        fill
                                        className="object-cover"
                                        />
                                    </a>
                                </div>
                            )}
                            {isPDF && (
                                <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                    <FileIcon className="h-10 w-10"/>
                                    <a
                                        href={fileUrl}
                                        className="ml-2 text-sm hover:underline">
                                            PDF File
                                    </a>
                                </div>
                            )}
                            {!fileUrl && !isEditing && (
                                <p className={cn(
                                    "text-sm text-zinc-600 dark dark:text-zinc-300",
                                    deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                                )}>
                                    {content}
                                    {isUpdated && !deleted && (
                                        <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                            (edited)
                                        </span>
                                    )}
                                </p>
                                )}
                                {isEditing && (
                                    <Form {...form}>
                                        <form className="flex items-center justify-start w-full gap-x-2 pt-2"
                                        onSubmit={form.handleSubmit(OnSubmit)}>
                                            <FormField
                                                control={form.control}
                                                name="content"
                                                render={({field})=>(
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative w-full">
                                                                <Input
                                                                className="p-2 lg:w-[1000px] bg-zinc-200/90 dark:bg-zinc-700/75
                                                                border-none border-0 focus-visible:ring-0
                                                                focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200
                                                                "
                                                                disabled={isLoading}
                                                                placeholder="Edited Message"
                                                                {...field}>
                                                                </Input>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />   
                                            <Button className="sm bg-zinc-100 dark:bg-zinc-800" variant="secondary" disabled={isLoading}>
                                                Save
                                            </Button>
                                        </form>
                                        <span className="text-[10px] mt-1 text-zinc-400">
                                            press Escape to cancel
                                        </span>
                                    </Form>
                                )}
                    </div>
            </div>
                    {canDeleteMessage && (
                        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-[110px]
                        bg-white dark:bg-zinc-800 rounded-sm border">
                            {canEditMessage && (
                                <Edit
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600
                                dark:hover:text-zinc-300 transition"
                                onClick={()=>setisEditing(true)}
                                />
                            )}
                            <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600
                                dark:hover:text-zinc-300 transition" onClick={()=>onOpen("deleteMessage",{
                                apiUrl:`${socketUrl}/${id}`,
                                query:socketQuery
                            })}/>
                        </div>
                    )}
                
            
        </div>
     );
}
 
export default ChatItem;