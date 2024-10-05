"use client"
import { Icon, Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
const VideoButton = () => {
    const pathname=usePathname();
    const router=useRouter();
    const searchParams=useSearchParams();
    const isVideo=searchParams?.get("video");
    const Icon=isVideo? VideoOff:Video;
    const OnClick=()=>{
        const url=qs.stringifyUrl({
            url:pathname || "",
            query:{
                video:isVideo?undefined:true,
            }
        },{skipNull:true});
        router.push(url);
    }
    return ( 
        <div>
            <button onClick={OnClick}>
                <Icon/>
            </button>
        </div>
     );
}
 
export default VideoButton;