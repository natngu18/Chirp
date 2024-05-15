import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AutosizeTextarea } from '@/components/AutosizeTextArea'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { useEffect, useState } from 'react'
import { arrayToFileList } from '@/lib/utils'
import MediaCarousel from './MediaCarousel'
const maxLength = 200
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]
const MAX_IMAGE_SIZE = 4 //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
    const result = sizeInBytes / (1024 * 1024)
    return +result.toFixed(decimalsNum)
}

const postSchema = z.object({
    text: z.string().max(maxLength, 'Maximum of 200 characters.'),
    images: z
        .custom<FileList>()
        // .refine((files) => {
        //     return Array.from(files ?? []).length !== 0
        // }, 'Image is required')
        .refine((files) => {
            return Array.from(files ?? []).every(
                (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE
            )
        }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
        .refine((files) => {
            return Array.from(files ?? []).every((file) =>
                ACCEPTED_IMAGE_TYPES.includes(file.type)
            )
        }, 'File type is not supported'),
    // formState.errors?.image?.message
})

type Props = {
    placeholder?: string
    buttonText?: string
}
function PostForm({
    placeholder = 'What are you thinking?',
    buttonText = 'Post',
}: Props) {
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            text: '',
        },
    })
    const [remaining, setRemaining] = useState(maxLength)
    const text = form.watch('text')

    const images = form.watch('images')

    useEffect(() => {
        setRemaining(maxLength - text.length)
    }, [text])

    const onSubmit = (values: z.infer<typeof postSchema>) => {
        console.log('values: ', values)
    }

    const handleMediaDelete = (index: number) => {
        // Remove the image from the array
        const updatedFileArray = Array.from(images).filter(
            (image, i) => i !== index
        )
        // Convert File[] to FileList for type compatibility
        const updatedFileList = arrayToFileList(updatedFileArray)
        form.setValue('images', updatedFileList)
    }
    return (
        <div className="flex flex-col gap-2 px-4">
            {/* Render images preview when there are images. */}
            {images?.length > 0 && (
                <div className="w-full flex justify-center items-center">
                    <MediaCarousel
                        medias={Array.from(images)}
                        onMediaDelete={handleMediaDelete}
                    />
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <FormField
                        control={form.control}
                        name="images"
                        render={({
                            field: { value, onChange, ...fieldProps },
                        }) => (
                            <FormItem>
                                <FormLabel>Resume</FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        type="file"
                                        accept="image/*, application/pdf"
                                        onChange={(event) => {
                                            if (event.target.files) {
                                                // Convert the FileList object to an array
                                                const newFiles = Array.from(
                                                    event.target.files
                                                )
                                                const currentFiles =
                                                    // Check if value is array before conversion (null or undefined causes error because they are not not iterable)
                                                    Array.isArray(value)
                                                        ? Array.from(value)
                                                        : []
                                                // Append the new files to the existing filesArray
                                                const updatedFilesArray = [
                                                    ...currentFiles,
                                                    ...newFiles,
                                                ]
                                                // Trigger the onChange event with the updated filesArray
                                                onChange(updatedFilesArray)
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    {/* <Textarea
                                        {...field}
                                        className="resize-none overflow-auto max-h-32"
                                    /> */}
                                    <AutosizeTextarea
                                        placeholder={placeholder}
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <div className="flex gap-3 items-center justify-end">
                <div className={remaining < 0 ? ` text-rose-500` : ``}>
                    {remaining}
                </div>

                <ButtonWithLoading
                    onClick={form.handleSubmit(onSubmit)}
                    className="rounded-full"
                    isLoading={false}
                    disabled={
                        // false
                        !form.formState.isValid || !form.formState.isDirty
                    }
                >
                    {buttonText}
                </ButtonWithLoading>
            </div>
        </div>
    )
}

export default PostForm
