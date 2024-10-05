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
import { ServerWithMemberswithProfiles } from "@/types";
  
const LeaveServerModel = () => {
    const {onOpen,isOpen,onClose, type, data}=useModel();
    const ismodelopen=isOpen  && type=="leaveServer";
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
            const response=await axios.delete(`/api/servers/${server?.id}/leave`);
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
                    <DialogTitle>Do you want to leave Server?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                    <Button onClick={()=>onDelete()}>Yes</Button>
                    <Button onClick={()=>handleClose()}>No</Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
     );
}
 
export default LeaveServerModel;