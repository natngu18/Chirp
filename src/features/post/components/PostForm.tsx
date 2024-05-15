import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AutosizeTextarea } from '@/components/AutosizeTextArea'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { useEffect, useRef, useState } from 'react'
import { arrayToFileList, cn, sizeInMB } from '@/lib/utils'
import MediaCarousel from './MediaCarousel'
import CircularButton from '@/components/CircularButton'
import { ImageIcon } from 'lucide-react'
import MediaPreview from './MediaPreview'
import { toast } from '@/components/ui/use-toast'
import { useCreatePost } from '../api/createPost'
const MAX_POST_TEXT_LENGTH = 200
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]
const MAX_IMAGE_SIZE_MB = 4
const MAX_NUMBER_OF_IMAGES = 4

const postSchema = z.object({
    text: z
        .string()
        .min(1, 'Text is required')
        .max(
            MAX_POST_TEXT_LENGTH,
            `Maximum of ${MAX_POST_TEXT_LENGTH} characters.`
        ),
    images: z
        .custom<FileList>()
        .refine((files) => {
            return Array.from(files ?? []).length <= MAX_NUMBER_OF_IMAGES
        }, 'Please upload a maximum of 4 images')
        .refine((files) => {
            return Array.from(files ?? []).every(
                (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE_MB
            )
        }, `The maximum image size is ${MAX_IMAGE_SIZE_MB}MB`)
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
        reValidateMode: 'onChange',
        mode: 'onChange',
        resolver: zodResolver(postSchema),
        defaultValues: {
            text: '',
        },
    })
    const { mutate, isPending } = useCreatePost()
    const [remainingText, setRemainingText] = useState(MAX_POST_TEXT_LENGTH)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const text = form.watch('text')
    const images = form.watch('images')

    useEffect(() => {
        setRemainingText(MAX_POST_TEXT_LENGTH - text.length)
    }, [text])

    const onSubmit = (values: z.infer<typeof postSchema>) => {
        console.log('subbmitting these values : ', values)
        mutate(
            {
                text: values.text,
                medias: Array.isArray(values.images)
                    ? Array.from(values.images)
                    : [],
            },
            {
                onSuccess: () => {
                    form.reset()
                    console.log('form values after reset: ', form.getValues())
                },
            }
        )
    }

    const handleMediaDelete = (index: number) => {
        // Remove the image from the array
        const updatedFileArray = Array.from(images).filter(
            (_, i) => i !== index
        )
        // Convert File[] to FileList for type compatibility
        const updatedFileList = arrayToFileList(updatedFileArray)
        form.setValue('images', updatedFileList, { shouldValidate: true })
    }
    return (
        <div className="flex flex-col gap-2 px-4">
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
                            // Hidden because a button will triger the file input using ref
                            <FormItem hidden={true}>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        ref={fileInputRef}
                                        multiple={true}
                                        type="file"
                                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                        onChange={(event) => {
                                            // User has selected files
                                            if (event.target.files) {
                                                // Only set images if resulting number of images is valid
                                                if (
                                                    event.target.files.length +
                                                        (images
                                                            ? images.length
                                                            : 0) <=
                                                    MAX_NUMBER_OF_IMAGES
                                                ) {
                                                    // Convert the FileList object to an array
                                                    const newFiles = Array.from(
                                                        event.target.files
                                                    )

                                                    const currentFiles =
                                                        // Convert the FileList object to an array, value can be null which causes error
                                                        Array.from(value || [])

                                                    // Append the new files to the existing filesArray
                                                    const updatedFilesArray = [
                                                        ...currentFiles,
                                                        ...newFiles,
                                                    ]
                                                    onChange(updatedFilesArray)
                                                }
                                                // Display toast for error in botom middle of screen
                                                else {
                                                    toast({
                                                        className: cn(
                                                            'fixed md:max-w-[420px] bottom-3 left-1/2 transform -translate-x-1/2'
                                                        ),
                                                        description: `Please choose up to 4 photos.`,
                                                    })
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <AutosizeTextarea
                                        placeholder={placeholder}
                                        minHeight={72}
                                        className="resize-none "
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {/* Uploaded images preview */}
            {images?.length > 0 && (
                <div className="w-full flex justify-center items-center">
                    {images.length > 1 ? (
                        // Show carousel if there are multiple images
                        // TODO: display total size of images and size for each image
                        <MediaCarousel
                            medias={Array.from(images)}
                            onMediaDelete={handleMediaDelete}
                        />
                    ) : (
                        <MediaPreview
                            file={Array.from(images)[0]}
                            onDelete={() => handleMediaDelete(0)}
                        />
                    )}
                </div>
            )}

            {/* Image errors */}
            {form.formState.errors?.images ? (
                <span className="text-sm font-medium text-destructive">
                    {form.formState.errors.images.message}
                </span>
            ) : null}

            {/* Bottom section of post widget */}
            <div className="flex gap-3 items-center justify-between">
                {/* Button to trigger image upload */}
                <CircularButton
                    onClick={() => fileInputRef?.current?.click()}
                    className="p-2"
                    disabled={images?.length === MAX_NUMBER_OF_IMAGES}
                >
                    <ImageIcon size={20} />
                </CircularButton>

                <div className="flex items-center gap-3">
                    <div className={remainingText < 0 ? ` text-rose-500` : ``}>
                        {remainingText}
                    </div>

                    <ButtonWithLoading
                        onClick={form.handleSubmit(onSubmit)}
                        className="rounded-full w-28"
                        isLoading={isPending}
                        disabled={
                            !form.formState.isValid || !form.formState.isDirty
                        }
                    >
                        {buttonText}
                    </ButtonWithLoading>
                </div>
            </div>
        </div>
    )
}

export default PostForm
