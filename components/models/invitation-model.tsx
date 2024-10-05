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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { UseOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
  
const InviteModel = () => {
    const {onOpen,isOpen,onClose, type, data}=useModel();
    const ismodelopen=isOpen  && type=="invite";
    const router=useRouter();
    const handleClose=()=>{
        onClose();
    }
    const origin=UseOrigin();
    const [copied,setCopied]=useState(false);
    const [IsLoading,setIsLoading]=useState(false);
    const {server}= data;
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`;
    const onCopy=()=>{
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(()=>{
            setCopied(false);
        },10000);
    }
    const onNew=async()=>{
        try{
            const response=await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite",{server:response.data});
        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
    
    return ( 
        <>
            <Dialog open={ismodelopen} onOpenChange={handleClose}>
                <DialogTrigger></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle> Invite your friends</DialogTitle>
                        <DialogDescription>
                            <div className="flex-col">
                                <Input value={inviteUrl}></Input>
                                <Button size="icon" onClick={onCopy}>
                                    {!copied ? <Copy className="w-4 l-4"/> :
                                    <Check/>}
                                </Button>
                                <Button onClick={()=>onNew()} variant="link">
                                    Generate a new link
                                </Button>
                            </div>
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
        </>
     );
}
 
export default InviteModel;