"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { FileUpIcon, Plus, Smile } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useModel } from "@/hooks/use-modal-store";
import EmojiPicker from "../emoji-picker";
import { useTheme } from "next-themes";
interface ChatInputProps{
    apiUrl:string,
    query:Record<string,any>,
    name:string,
    type:"conversation" | "channel",
    fileUrl?:string
}
const formSchema=z.object({
    content:z.string().min(1),
})
const ChatInput = ({apiUrl,query,name,type,fileUrl}:ChatInputProps) => {
    
    const form= useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            content:"",
        }
    })
    const isLoading=form.formState.isSubmitting;
    const {onOpen}=useModel();
    const onSubmit=async(values: z.infer<typeof formSchema>)=>{
        try{
            const url=qs.stringifyUrl({
                url:apiUrl,
                query
            })
            await axios.post(url,values);
            form.reset();
        }catch(error){
            console.log(error);
        }
        console.log(values);
    }
    return ( 
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField 
                    control={form.control}
                    name="content"
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6 w-full">
                                    <button type="button" className="absolute top-7 left-8 h-[24px]
                                    w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                                    dark:hover:bg-zinc-300 transition rounded-full p-1 flex
                                    items-center justify-center"
                                    onClick={()=>{onOpen("uploadFile",{apiUrl,query})}}>
                                        <Plus className="text-white dark:text-[#313338]"/>
                                    </button>
                                    <Input placeholder="Enter message" disabled={isLoading} {...field}
                                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                                    focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"/>
                                    <div className="flex flex-row absolute right-11 md:absolute md:right-28 gap-x-2 top-7">
                                        <EmojiPicker
                                        onChange={(emoji:string)=>field.onChange(`${field.value} ${emoji}`)}/>
                                        <FileUpIcon onClick={()=>{onOpen("uploadFile",{apiUrl,query})}}/>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                </form>
            </Form>
        </div>
     );
}
 
export default ChatInput;
