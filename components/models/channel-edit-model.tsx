"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import { Button } from "../ui/button";
  import * as z from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import {useForm} from "react-hook-form"
  import { Channel, ChannelType } from "@prisma/client"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModel } from "@/hooks/use-modal-store";
import qs from "query-string"
import { ServerWithMemberswithProfiles } from "@/types"
import { useEffect } from "react"
  const formschema=z.object({
    name:z.string().min(1,{
        message:"Server name is required"
    }),
    type:z.string().min(1,{
        message:"Type is required"
    })
})
const EditChannelModel = () => {
    const form = useForm({
        resolver:zodResolver(formschema),
        defaultValues:{
            name:"",
            type:ChannelType.TEXT
        }
    });
    const {isOpen,onClose, type, onOpen,data}=useModel();
    const ismodelopen=isOpen  && type=="editChannel"
    const isLoadingState=form.formState.isSubmitting;
    const {channel}=data as {channel:Channel};
    const router=useRouter();
    const {server}= data as {server:ServerWithMemberswithProfiles};
    useEffect(()=>{
        if(server){
            form.setValue("name",channel?.name);
            form.setValue("type",channel?.type);
        }
    },[]);
    const onSubmit=async(values: z.infer<typeof formschema>)=>{
        try{
            console.log(values);
            const url=qs.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query:{
                    serverId:server?.id
                }
            })
            const response=await axios.patch(url,values);
            router.refresh();
            onClose();
        }catch(error){
            console.log(error);
        }
    }
    const handleClose=()=>{
        form.reset();
        onClose();
    }
    return ( 
        <>
            <Dialog open={ismodelopen} onOpenChange={handleClose}>
                <DialogTrigger></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle> Create a new Channel</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Channel name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your channel name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField 
                                control={form.control}
                                name="type"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel>
                                            Select the type of Channel
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Text" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ChannelType.TEXT}>Text</SelectItem>
                                                <SelectItem value={ChannelType.AUDIO}>Audio</SelectItem>
                                                <SelectItem value={ChannelType.VIDEO}>Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                            </Form>
                    </DialogContent>
                </Dialog>
        </>
     );
}
 
export default EditChannelModel;