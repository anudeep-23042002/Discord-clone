import { Channel, Server } from "@prisma/client";
import {create} from "zustand";
export type ModelType="createServer" | "invite" | "editServer" | "manageMembers" | "createChannel" | "deleteServer" 
| "leaveServer" | "deleteChannel" | "editChannel" | "uploadFile" | "deleteMessage";

interface ModelData{
    server?:Server
    channel?:Channel
    apiUrl?:string
    query?:Record<string,any>;
}
interface ModalStore{
    type:ModelType|null;
    data:ModelData;
    isOpen:boolean;
    onOpen:(type:ModelType,data?:ModelData)=>void;
    onClose:()=>void;
}

export const useModel=create<ModalStore>((set)=>({
    type:null,
    data:{},
    isOpen:false,
    onOpen:(type,data={})=>set({isOpen:true,type,data}),
    onClose:()=>set({type:null,isOpen:false})
}));