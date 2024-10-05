"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {redirect, useRouter } from "next/navigation";
import { useModel } from "@/hooks/use-modal-store";
import { UseOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import qs from "query-string";
import { ServerWithMemberswithProfiles } from "@/types";
  
const DeleteServerModel = () => {
    const {onOpen,isOpen,onClose, type, data}=useModel();
    const ismodelopen=isOpen  && type=="deleteServer";
    const router=useRouter();
    const handleClose=()=>{
        onClose();
    }
    const origin=UseOrigin();
    const [IsLoading,setIsLoading]=useState(false);
    const {server}= data as {server:ServerWithMemberswithProfiles};
    const onDelete=async()=>{
        try{
            setIsLoading(true);
            const response=await axios.delete(`/api/servers/${server?.id}/delete`);
            onClose();
            router.refresh();
            router.push("/");
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
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your server.
                    </DialogDescription>
                    <Button onClick={()=>onDelete()}>Yes</Button>
                    <Button onClick={()=>handleClose()}>No</Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
     );
}
 
export default DeleteServerModel;