"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModel } from "@/hooks/use-modal-store";
import qs from "query-string"
import { ServerWithMemberswithProfiles } from "@/types"
import { Channel } from "@prisma/client";
const ChannelDeleteModel = () => {
    
    const {isOpen,onClose, type, onOpen,data}=useModel();
    const ismodelopen=isOpen  && type=="deleteChannel"
    const router=useRouter();
    const {server}= data as {server:ServerWithMemberswithProfiles};
    const {channel}=data as {channel:Channel};
    const onSubmit=async()=>{
        try{
            const url=qs.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query:{
                    serverId:server?.id,
                }
            })
            const response=await axios.delete(url);
            router.refresh();
            onClose();
        }catch(error){
            console.log("ERROR IN YES",error);
        }
    }
    const handleClose=()=>{
        onClose();
    }
    return ( 
        <>
            <Dialog open={ismodelopen} onOpenChange={handleClose}>
                <DialogTrigger></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle> Are you sure you want to delete this channel?</DialogTitle>
                        </DialogHeader>
                        <Button onClick={()=>onSubmit()}>Yes</Button>
                        <Button>No</Button>
                    </DialogContent>
                </Dialog>
        </>
     );
}
 
export default ChannelDeleteModel;