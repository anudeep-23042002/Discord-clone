"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModel } from "@/hooks/use-modal-store";
import qs from "query-string"
const MessageDeleteModel = () => {
    const {isOpen,onClose, type, onOpen,data}=useModel();
    const ismodelopen=isOpen  && type=="deleteMessage";
    const router=useRouter();
    const {apiUrl,query}=data;
    const onSubmit=async()=>{
        try{
            const url=qs.stringifyUrl({
                url:apiUrl || "",
                query:query
            })
            const response=await axios.delete(url);
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
                        <DialogTitle> Are you sure you want to delete this Message?</DialogTitle>
                        </DialogHeader>
                        <Button onClick={()=>onSubmit()}>Yes</Button>
                        <Button>No</Button>
                    </DialogContent>
                </Dialog>
        </>
     );
}
 
export default MessageDeleteModel;