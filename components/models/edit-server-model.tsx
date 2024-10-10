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
import FileUpload from "../ui/fileupload";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { useModel } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { ServerWithMemberswithProfiles } from "@/types";
import { Loader2 } from "lucide-react";
  const formschema=z.object({
    name:z.string().min(1,{
        message:"Server name is required"
    }),
    imageUrl:z.string().min(1,{
        message:"ImageUrl name is required"
    })
})
const EditServerModel = () => {
    const {isOpen,onClose, type, data}=useModel();
    const {server}=data as {server:ServerWithMemberswithProfiles};
    const form = useForm({
        resolver:zodResolver(formschema),
        defaultValues:{
            name:server?.name || "",
            imageUrl:server?.imageUrl || "",
        }
    });
    useEffect(()=>{
        if(server){
            form.setValue("name",server?.name);
            form.setValue("imageUrl",server?.imageUrl);
        }
    },[form,server]);
    
    const ismodelopen=isOpen  && type=="editServer"
    const isLoadingState=form.formState.isSubmitting;
    const router=useRouter();

    const onSubmit=async(values: z.infer<typeof formschema>)=>{
        try{
            await axios.patch(`/api/servers/${server?.id}`,values);
            form.reset();
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
            {isLoadingState && (
                <div>
                    <Loader2 className="animate-spin w-4 h-4"/>
                </div>
            )}
            <Dialog open={ismodelopen} onOpenChange={handleClose}>
                <DialogTrigger></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle> Create a new server</DialogTitle>
                        <DialogDescription>
                            Give your server a name and a picture.
                        </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField 
                                control={form.control}
                                name="imageUrl"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            onchange={field.onChange}
                                            value={field.value}
                                            endpoint="ServerImage"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Server name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your server name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                                <Button type="submit">Submit</Button>
                            </form>
                            </Form>
                    </DialogContent>
                </Dialog>
        </>
     );
}
 
export default EditServerModel;