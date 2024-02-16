"use client"

import { ChevronDown, ChevronUp, Divide, Loader, Loader2, Search } from 'lucide-react'
import {Document, Page, pdfjs} from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useToast } from './ui/use-toast'

import {useResizeDetector} from 'react-resize-detector'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'

import {useForm} from 'react-hook-form'
import { z } from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

 
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`


interface PdfRendererProps {
    url : string
}

const PdfRenderer = ({url}:PdfRendererProps) => {
    const {toast} = useToast()

    const {width,ref} = useResizeDetector()

    const [numPages, setNumPages] = useState<number>();
    const [currPage, setCurrPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);

    const CustomPageValidator =z.object({
        page: z.string().refine((num)=>Number(num)>0 && Number(num)>=numPages!)
    })

    type TCustomPageValidator = z.infer<typeof CustomPageValidator>


    const {
        register, 
        handleSubmit, 
        formState: {errors},
        setValue
    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page:'1'
        },
        resolver: zodResolver(CustomPageValidator)
    })

    const handlePageSubmit = ({
        page,
    }: TCustomPageValidator) => {
        setCurrPage(Number(page))
        setValue('page', String(page))

     
    }


return(
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
        <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
                <Button 
                disabled={currPage <=1 }
                onClick={()=>{
                    setCurrPage((prev)=>(prev-1>1 ? prev-1 : 1))
                }}
                variant='ghost' aria-label='previous page' >
                    <ChevronDown className='h-4 w-4' />
                </Button>

                <div className='flex items-center gap-1.5'>
                    <Input 
                    {...register('page')} 
                    onKeyDown={(e)=> {
                        if(e.key === 'Enter') {
                            handleSubmit(handlePageSubmit)
                        }
                    }}
                    className={cn('w-12 h-6 bg-gray-100 border-none', errors.page && 'focus-visible:ring-red-500')}
                    />
                    <p className='text-zinc-700 text-sm space-x-1'>
                        <span>/</span>
                        <span>{numPages ?? <Loader2 className=' h-2 w-2 animate-spin' />}</span>
                    </p>
                </div>

                <Button
                disabled={currPage === numPages || numPages === undefined }
                onClick={()=>{
                    setCurrPage((prev)=>(prev+1>numPages! ? numPages! : prev+1))
                }}
                variant='ghost' aria-label='next page' >
                    <ChevronUp className='h-4 w-4' />
                </Button>
            </div>    

            <div className='space-x-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className='gap-1.5' variant='ghost' aria-label='zoom' >
                            <Search className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            100%
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        
        <div className="flex-1 w-full max-h-screen">
            <div ref={ref} >
                <Document 
                loading={
                    <div className='flex justify-center'> <Loader className='my-24 h-6 w-6 animate-spin' /> </div>
                }
                onLoadError={()=> {
                    toast({
                        title:'Something went wrong',
                        description:'Error loading yout Pdf file',
                        variant:'destructive',
                    })
                }}
                onLoadSuccess={({numPages})=> setNumPages(numPages)}
                file={url} className='max-h-full'>
                    <Page width={width?width:1} pageNumber={currPage} />
                </Document>
            </div>
        </div>
    </div>
)
}

export default PdfRenderer