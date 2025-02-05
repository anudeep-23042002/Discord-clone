import { db } from "./db"

export const getOrCreateConversation=async(memberOneId:string,memberTwoId:string)=>{
    const conversation=await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId);
    if(!conversation){
        return await createNewConversation(memberOneId,memberTwoId);
    }
    return conversation;
}
const findConversation=async(memberOneId : string,memberTwoId : string,)=>{
    try{
        return await db.conversation.findFirst({
            where:{
                AND:[
                    {memberOneId:memberOneId},
                    {memberTwoId:memberTwoId}
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        });
    }catch(error){
        return null;
    }
}
const createNewConversation=async(memberOneId : string,memberTwoId : string,)=>{
    try{
        return await db.conversation.create({
            data:{
                memberOneId:memberOneId,
                memberTwoId:memberTwoId
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        });
    }catch(error){
        return null;
    }
}