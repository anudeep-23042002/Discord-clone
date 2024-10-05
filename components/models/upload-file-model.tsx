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
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModel } from "@/hooks/use-modal-store";
import qs from "query-string";
  const formschema=z.object({
    FileUrl:z.string().min(1,{
        message:"ImageUrl name is required"
    })
})
const UploadfileModel = () => {
    const form = useForm({
        resolver:zodResolver(formschema),
        defaultValues:{
            FileUrl:""
        }
    });

    const isLoadingState=form.formState.isSubmitting;
    const router=useRouter();
    const {isOpen,onClose, type, data}=useModel();
    const {apiUrl,query}=data;
    const ismodelopen=isOpen  && type=="uploadFile";

    const onSubmit=async(values: z.infer<typeof formschema>)=>{
        try{
            const url=qs.stringifyUrl({
                url:apiUrl || "",
                query:query,
            })
            const response=await axios.post(url,{...values,content:values.FileUrl});
            form.reset();
            router.refresh();
            window.location.reload();
        }catch(error){
            console.log(error);
        }
    }
    const handleClose=()=>{
        form.reset();
        onClose();
    }
    return ( 
        <div>
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
                                name="FileUrl"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            onchange={field.onChange}
                                            value={field.value}
                                            endpoint="MessageFile"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                            </Form>
                    </DialogContent>
                </Dialog>
        </div>
     );
}
 
export default UploadfileModel;