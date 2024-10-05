import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser} from "@clerk/nextjs/server";
 
const f = createUploadthing();
 
const handleauth = () => {
  const userId= currentUser();
  if(!userId){
    throw new Error("Unauthorized");
  }
  return {userId:userId};
};
 
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  ServerImage: f({ image: { maxFileSize: "4MB", maxFileCount :1} })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => { return handleauth();})
    .onUploadComplete(() => {}),
  MessageFile: f(["image","pdf"])
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => { return handleauth();})
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;