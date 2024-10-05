"use client"

import { useState,useEffect } from "react";
import CreateServerModel from "../models/create-server-model";
import EditServerModel from "../models/edit-server-model";
import InviteModel from "../models/invitation-model";
import ManageMemberModel from "../models/manage-members-model";
import ChannelCreationModel from "../models/channel-creation-model";
import DeleteServerModel from "../models/delete-server-model";
import LeaveServerModel from "../models/leave-server-model";
import ChannelDeleteModel from "../models/channel-delete-model";
import EditChannelModel from "../models/channel-edit-model";
import UploadfileModel from "../models/upload-file-model";
import MessageDeleteModel from "../models/message-delete-model";

const ModelProvider = () => {
    const [isMounted, setIsMounted]=useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);
    if(!isMounted){
        return null;
    }
    return ( 
        <>
            <CreateServerModel/>
            <InviteModel/>
            <EditServerModel/>
            <ManageMemberModel/>
            <ChannelCreationModel/>
            <DeleteServerModel/>
            <LeaveServerModel/>
            <ChannelDeleteModel/>
            <EditChannelModel/>
            <UploadfileModel/>
            <MessageDeleteModel/>
        </>
     );
}
 
export default ModelProvider;