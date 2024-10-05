import initialprofile from "../../lib/initialprofile"
import {db} from "../../lib/db"
import InitialModel from "@/components/models/initialmodel";
import { redirect } from "next/navigation";
const Setuppage=async()=>{
  const profile= await initialprofile();
  const server=await db.server.findFirst({
    where:{
      members:{
        some:{
          profileId:profile.id
        }
      }
    }
  });
  if(server){
    return redirect(`servers/${server.id}`);
  }
  return (
    <h1> <InitialModel/></h1>
  );
}
export default Setuppage;