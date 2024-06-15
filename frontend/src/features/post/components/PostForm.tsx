import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AutosizeTextarea } from '@/components/AutosizeTextArea'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { useRef } from 'react'
import { arrayToFileList, cn, sizeInMB } from '@/lib/utils'
import MediaCarousel from './MediaCarousel'
import CircularButton from '@/components/CircularButton'
import { ImageIcon } from 'lucide-react'
import MediaPreview from './MediaPreview'
import { useToast } from '@/components/ui/use-toast'
import { useCreatePost } from '../api/createPost'
import { ToastAction } from '@/components/ui/toast'
import { useNavigate } from 'react-router'
const MAX_POST_TEXT_LENGTH = 200
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_IMAGE_SIZE_MB = 4
const MAX_NUMBER_OF_IMAGES_FOR_POST = 4

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
            return (
                Array.from(files ?? []).length <= MAX_NUMBER_OF_IMAGES_FOR_POST
            )
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
    parentPostId?: string
    onPostSuccess?: () => void
    showToast?: boolean
}
function PostForm({
    placeholder = 'What are you thinking?',
    buttonText = 'Post',
    parentPostId,
    onPostSuccess,
    showToast = true,
}: Props) {
    const form = useForm<z.infer<typeof postSchema>>({
        reValidateMode: 'onChange',
        mode: 'onChange',
        resolver: zodResolver(postSchema),
        defaultValues: {
            text: '',
            images: undefined,
        },
    })
    const { toast } = useToast()
    const navigate = useNavigate()
    const { mutate, isPending } = useCreatePost(parentPostId)
    // const [remainingText, setRemainingText] = useState(MAX_POST_TEXT_LENGTH)
    // Used to trigger file input w/ button
    const fileInputRef = useRef<HTMLInputElement>(null)

    const text = form.watch('text')
    const images = form.watch('images')

    // useEffect(() => {
    //     setRemainingText(MAX_POST_TEXT_LENGTH - text.length)
    // }, [text])

    const onSubmit = (values: z.infer<typeof postSchema>) => {
        console.log(values)
        mutate(
            {
                text: values.text,
                medias: Array.isArray(values.images)
                    ? Array.from(values.images)
                    : [],
            },
            {
                onSuccess: (postId) => {
                    form.reset()
                    onPostSuccess?.()
                    if (showToast) {
                        toast({
                            className: cn(
                                'fixed md:max-w-[420px] bottom-3 left-1/2 transform -translate-x-1/2'
                            ),
                            description: `Post created!`,
                            action: (
                                <ToastAction
                                    altText="Goto created post"
                                    onClick={() => navigate(`/post/${postId}`)}
                                >
                                    View
                                </ToastAction>
                            ),
                        })
                    }
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
        <div className="flex flex-col gap-2 px-4 py-2">
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
                                        data-testid="post-file-input"
                                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                        onChange={(event) => {
                                            // User has selected files
                                            if (
                                                event.target.files &&
                                                event.target.files.length > 0
                                            ) {
                                                // Convert the FileList object to an array
                                                const newFiles = Array.from(
                                                    event.target.files
                                                )
                                                // Check if any of the new files are larger than the maximum size
                                                const isAnyFileTooLarge =
                                                    newFiles.some(
                                                        (file) =>
                                                            file.size >
                                                            MAX_IMAGE_SIZE_MB *
                                                                1024 *
                                                                1024
                                                    )
                                                if (isAnyFileTooLarge) {
                                                    toast({
                                                        className: cn(
                                                            'fixed md:max-w-[420px] bottom-3 left-1/2 transform -translate-x-1/2'
                                                        ),
                                                        description: `Please choose files smaller than ${MAX_IMAGE_SIZE_MB}MB.`,
                                                    })
                                                    return
                                                }
                                                // Only set images if resulting number of images is valid (user can select multiple imgs)
                                                const isValidNumberOfImages =
                                                    newFiles.length +
                                                        (images
                                                            ? images.length
                                                            : 0) <=
                                                    MAX_NUMBER_OF_IMAGES_FOR_POST
                                                if (!isValidNumberOfImages) {
                                                    toast({
                                                        className: cn(
                                                            'fixed md:max-w-[420px] bottom-3 left-1/2 transform -translate-x-1/2'
                                                        ),
                                                        description: `Please choose up to ${MAX_NUMBER_OF_IMAGES_FOR_POST} photos.`,
                                                    })
                                                    return
                                                }

                                                const currentFiles = Array.from(
                                                    value || []
                                                )
                                                // Append the new files to the existing filesArray
                                                const updatedFilesArray = [
                                                    ...currentFiles,
                                                    ...newFiles,
                                                ]
                                                onChange(updatedFilesArray)
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
                                    <div className="relative">
                                        <AutosizeTextarea
                                            minHeight={72}
                                            className="resize-none pt-3"
                                            placeholder={placeholder}
                                            {...field}
                                        />
                                        <span
                                            className={`absolute top-0 right-1 text-xs  ${
                                                text.length >
                                                MAX_POST_TEXT_LENGTH
                                                    ? 'text-rose-500'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {text?.length}/
                                            {MAX_POST_TEXT_LENGTH}
                                        </span>
                                    </div>
                                </FormControl>
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
                    disabled={images?.length === MAX_NUMBER_OF_IMAGES_FOR_POST}
                >
                    <ImageIcon size={20} />
                </CircularButton>

                <div className="flex items-center gap-3">
                    <ButtonWithLoading
                        onClick={form.handleSubmit(onSubmit)}
                        className="rounded-full w-28 bg-sky-500 hover:bg-sky-500/90"
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
