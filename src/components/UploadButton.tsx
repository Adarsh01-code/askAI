"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from 'react-dropzone'
import { Cloud, File } from "lucide-react";
import { Progress } from "./ui/progress";



const UploadDropzone = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState<boolean>(true);
    const [isHovered, setIsHovered] = useState(false);

    const startSimulatingProgress = () => {
        setUploadProgress(0);

        const interval = setInterval(()=>{
            setUploadProgress((prevProgress) => {
                if(prevProgress >= 95) {
                    clearInterval(interval);
                    return prevProgress
                }

                return prevProgress + 5
            })
        },500)

        return interval
    }

    return <Dropzone multiple={false} onDrop={async (acceptedFile)=> {
        setIsUploading(true)

        const progressInterval = startSimulatingProgress()

        await new Promise((resolve) => setTimeout(resolve,2000))

        clearInterval(progressInterval)
        setUploadProgress(100)
    }}>
        {({getRootProps, getInputProps, acceptedFiles}) => (
            <div {...getRootProps()} className="bg-gray-50 border h-64 m-4 border-dashed rounded-lg border-gray-300">
                <div className="flex items-center justify-center h-full w-full">
                    <label 
                    htmlFor="dropzone-file"
                    className="flex items-center justify-center flex-col w-full h-full rounded-lg cursor-pointer  hover:bg-gray-100"
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Cloud id="cloudIcon" className={`h-6 w-6 mb-2 ${isHovered ? 'text-blue-400' : 'text-zinc-400'}`}  />
                            
                            <p className="mb-2 text-sm text-zinc-700">
                            <span className="font-semibold">Click to Upload</span> {' '}
                                 or  drag n drop </p>

                                 <p className="text-xs text-zinc-500">Pdf ( up to 4MB )</p>
                        </div>

                        {acceptedFiles && acceptedFiles[0] ? (
                            <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                <div className="px-3 py-2 h-full grid place-items-center">
                                    <File className="h-4 w-4 text-blue-500" />
                                </div>
                                <div className="px-3 py-2 h-full text-xs truncate">
                                    {acceptedFiles[0].name}
                                </div>
                            </div>
                        ): null}

                        {isUploading? (
                            <div className="w-full mt-4 max-w-xs mx-auto">
                                <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200 "/>
                            </div>
                        ): null}
                    </label>
                </div>
            </div>
        )}
    </Dropzone>
}

const  UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
    open={isOpen}
    onOpenChange={
        (v)=>{
            if(!v) setIsOpen(v);
        }}
    >
        <DialogTrigger onClick={()=> setIsOpen(true)} asChild>
            <Button>
                Upload PDF 
            </Button>
        </DialogTrigger>
        <DialogContent>
            <UploadDropzone />
        </DialogContent>
    </Dialog>
  )
}

export default UploadButton
