import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {OpenAIEmbeddings} from '@langchain/openai'


import { pinecone } from "@/lib/pinecone";

import {PineconeStore} from '@langchain/pinecone'
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
        const {getUser} = getKindeServerSession()
        const user =await getUser()

        if(!user || !user.id) throw new Error("Unauthorized")

        const subscriptionPlan = await getUserSubscriptionPlan()
      return {subscriptionPlan ,userId : user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus:"PROCESSING"
        }
      })

      try {
        const response = await fetch(file.url)
       
        const blob = await response.blob()

        const loader = new PDFLoader(blob)

        const pageLevelDocs = await loader.load()
        const pageAmt = pageLevelDocs.length

        const {subscriptionPlan} = metadata
        const {isSubscribed} = subscriptionPlan

        const isProExceeded = pageAmt > PLANS.find((plan)=> plan.name === "Pro")!.pagesPerPdf 
        const isFreeExceeded = pageAmt > PLANS.find((plan)=> plan.name === "Free")!.pagesPerPdf 

        if((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded))
        {
          await db.file.update({
            data: {
              uploadStatus: 'FAILED',
            },
            where: {
              id:createdFile.id,
            },
          })
        }
        //vectorize and index entire document


        // const pinecone =await getPineconeClient()

        const pineconeIndex = pinecone.Index('ask-ai')

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })

        await PineconeStore.fromDocuments(
          pageLevelDocs,
          embeddings,
          {
            pineconeIndex,
            namespace: createdFile.id
          }
        )

        await db.file.update({
          data : {
            uploadStatus: "SUCCESS"
          },
          where : {
            id: createdFile.id
          }
        })
      } 
      
      catch (err) {

        await db.file.update({
          data : {
            uploadStatus: "SUCCESS"
          },
          where : {
            id: createdFile.id
          }
        })
        // console.log(err)
        
      }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;