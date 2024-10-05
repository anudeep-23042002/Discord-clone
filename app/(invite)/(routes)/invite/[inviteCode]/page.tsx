import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteParams {
  params: {
    inviteCode: string;
  };
}

const InviteCode = async ({ params }: InviteParams) => {
  const profile = await Currentprofile();
  if (!profile) {
    return redirect("/");
  }

  if (!params.inviteCode) {
    console.log("Invite code not provided");
    return redirect("/");
  }

  const existingserver = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some:{
          profileId:profile?.id,
        }
      },
    },
  });
  
  if(existingserver){
    return redirect(`/servers/${existingserver.id}`);
  }
  const updateserver=await db.server.update({
    where:{
      inviteCode:params.inviteCode,
    },
    data:{
      members:{
        create:[{
          profileId:profile.id,
        }]
      }
    }
  })
  if(updateserver){
    return redirect(`/servers/${updateserver.id}`)
  }
  return (
    <div>Hello</div>
  );
};

export default InviteCode;
