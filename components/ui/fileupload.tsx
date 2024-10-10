"use client"
import { UploadDropzone } from "../../lib/uploadthing";
import "@uploadthing/react/styles.css";
import {X} from "lucide-react";
import Image from 'next/image';
interface FileUploadprops{
    onchange:(url?:string)=>void,
    endpoint:"ServerImage" | "MessageFile",
    value:string
};
const FileUpload = ({onchange,endpoint,value}:FileUploadprops) => {
    const fileType=value?.split(".").pop();
    if(value && fileType!="pdf"){
        return (
            <div className="relative ml-5 h-20 w-20">
                <Image
                fill
                src={value}
                alt="upload"
                className="rounded-full"
                />
                <button>
                    <X
                    onClick={()=>onchange("")}
                    className="bg-red-800 text-white-p1 rounded-full absolute top-0 right-0 shadow-sm"
                />
                </button>
            </div>
        )
    }
    return (  
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            onchange(res?.[0].url)
        }}
        onUploadError={(error:Error)=>{
            console.log(error);
        }}
        />
    );
}
 
export default FileUpload;