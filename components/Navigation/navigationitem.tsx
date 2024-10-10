"use client"
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
interface serverprops{
    server:{
        id:string,
        imageUrl:string,
        name:string
    }
};
const NavigationItem = ({server}:serverprops) => {
    const router=useRouter();
    const params=useParams();
    const handleclick=()=>{
        console.log("router pushed",server.id)
        router.push(`/servers/${server.id}`);
    }
    return ( 
        <div className="flex items-center">
            <button onClick={handleclick} className="group relative flex items-center">
            <div
                className={cn(
                "ml-2 bg-primary rounded-r-full transition-all w-[4px]",
                "flex items-center",
                params?.serverId !== server.id && "group-hover:h-[20px]",
                params?.serverId === server.id ? "h-[36px]" : "h-[8px]",
                "mt-[0.01125rem]"
                )}
            />
            <div
                className={cn(
                "mx-1 relative h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                params?.serverId === server.id && "bg-primary/10 text-primary"
                )}
            >
                <Image
                fill
                src={server.imageUrl}
                alt="upload"
                loading="eager"
                style={{
                    borderRadius: "30%",
                    objectFit: "cover",
                    border: "2px solid #6b7280",
                }}
                />
            </div>
            </button>
      </div>
      
     );
}
 
export default NavigationItem;