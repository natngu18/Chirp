import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AutosizeTextarea } from '@/components/AutosizeTextArea'
import { useRef } from 'react'
import { cn, getDirtyValues, sizeInMB } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import EditUserImage from './EditUserImage'
import React from 'react'
import { UseMutateFunction } from '@tanstack/react-query'
import { UpdateUserCommand } from '../types'
const MAX_BIO_LENGTH = 160
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_IMAGE_SIZE_MB = 4
const MAX_LOCATION_LENGTH = 30
const MAX_DISPLAY_NAME_LENGTH = 30

const editProfileSchema = z.object({
    bio: z
        .string()
        .max(MAX_BIO_LENGTH, `Maximum of ${MAX_BIO_LENGTH} characters.`),
    location: z
        .string()
        .max(
            MAX_LOCATION_LENGTH,
            `Maximum of ${MAX_LOCATION_LENGTH} characters.`
        ),
    displayName: z
        .string()
        .min(1, 'Name cannot be empty')
        .max(
            MAX_DISPLAY_NAME_LENGTH,
            `Maximum of ${MAX_DISPLAY_NAME_LENGTH} characters.`
        ),
    avatarImage: z.string().or(
        z
            .custom<FileList>()
            .refine((files) => {
                return Array.from(files ?? []).length == 1
            }, 'Please upload a maximum of 1 image')
            .refine((files) => {
                return Array.from(files ?? []).every(
                    (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE_MB
                )
            }, `The maximum image size is ${MAX_IMAGE_SIZE_MB}MB`)
            .refine((files) => {
                return Array.from(files ?? []).every((file) =>
                    ACCEPTED_IMAGE_TYPES.includes(file.type)
                )
            }, 'File type is not supported')
    ),

    backgroundImage: z.string().or(
        z
            .custom<FileList>()
            .nullable() // background image can be null
            .refine((files) => {
                return files == null || Array.from(files).length == 1
            }, 'Please upload a maximum of 1 image')
            .refine((files) => {
                return Array.from(files ?? []).every(
                    (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE_MB
                )
            }, `The maximum image size is ${MAX_IMAGE_SIZE_MB}MB`)
            .refine((files) => {
                return Array.from(files ?? []).every((file) =>
                    ACCEPTED_IMAGE_TYPES.includes(file.type)
                )
            }, 'File type is not supported')
    ),
})

type Props = {
    onSubmit: UseMutateFunction<void, Error, UpdateUserCommand, unknown>
    defaultValues?: z.infer<typeof editProfileSchema>
    onSuccess: () => void
}
const EditProfileForm = React.forwardRef<HTMLButtonElement, Props>(
    ({ onSubmit, defaultValues, onSuccess }, submitRef) => {
        const defaultBackgroundImage = defaultValues?.backgroundImage
        // Store ref to determine if user is deleting bg image (after submitting form)
        const backgroundImageDefaultValueRef = useRef(defaultBackgroundImage)
        const form = useForm<z.infer<typeof editProfileSchema>>({
            reValidateMode: 'onChange',
            mode: 'onChange',
            resolver: zodResolver(editProfileSchema),
            defaultValues,
        })
        const { toast } = useToast()
        const avatarImage = form.watch('avatarImage')
        const backgroundImage = form.watch('backgroundImage')
        const bio = form.watch('bio')
        const location = form.watch('location')
        const displayName = form.watch('displayName')

        // Used to trigger file input w/ button
        const avatarImageInputRef = useRef<HTMLInputElement>(null)
        const backgroundImageInputRef = useRef<HTMLInputElement>(null)
        const onFormSubmit = (values: z.infer<typeof editProfileSchema>) => {
            const dirtyValues = getDirtyValues(
                form.formState.dirtyFields,
                values
            )
            // Calculation of bg image is mroe complex, can't
            // rely on dirty values above
            let isDeletingBackgroundImage = false
            if (
                // BG differs from intiial default val (def. val. can be null or url string)
                backgroundImageDefaultValueRef.current !=
                    values.backgroundImage &&
                // user hasn't uploaded a new bg image
                // user uploading new bg image replaces the old one in DB, not deletes
                values.backgroundImage == null
            ) {
                isDeletingBackgroundImage = true
            }
            const submitData = {
                avatar: dirtyValues.avatarImage // This will never be a string
                    ? (dirtyValues.avatarImage[0] as File)
                    : undefined,
                backgroundImage: dirtyValues.backgroundImage // This will never be a string
                    ? (dirtyValues.backgroundImage[0] as File)
                    : undefined,
                bio: dirtyValues.bio,
                displayName: dirtyValues.displayName,
                location: dirtyValues.location,
                deleteBackgroundImage: isDeletingBackgroundImage,
            }
            const { deleteBackgroundImage, ...restSubmitData } = submitData
            //  Only submit data to API if there are changes
            // (deletebackgroundimage is true, or one field is non null)
            if (
                deleteBackgroundImage ||
                Object.values(restSubmitData).some((value) => value != null)
            ) {
                onSubmit(submitData, {
                    onSuccess: onSuccess,
                })
            } else {
                // if no changes, just call onSuccess
                onSuccess()
            }
        }

        return (
            <div className="flex flex-col gap-2 px-4 py-2">
                <div className="relative ">
                    {/* Background image */}
                    <EditUserImage
                        className="aspect-[3/1]"
                        imageUrl={
                            backgroundImage // background image can be null
                                ? typeof backgroundImage === 'string' // image url (pre-existing bg image)
                                    ? backgroundImage
                                    : URL.createObjectURL(
                                          Array.from(
                                              backgroundImage as FileList // new uploaded bg image
                                          )[0]
                                      )
                                : undefined // will render place holder gray block
                        }
                        onEdit={() => backgroundImageInputRef?.current?.click()} // trigger file input
                        onDelete={
                            backgroundImage
                                ? () => {
                                      form.setValue('backgroundImage', null, {
                                          shouldValidate: true,
                                          shouldDirty: true, // since field changes
                                      })
                                  }
                                : undefined // onDelete renders a button to delete image, not necessary if it doesnt yet exist
                        }
                    />
                    {/* Avatar */}
                    <EditUserImage
                        roundedImage={true}
                        className="aspect-square absolute  h-24 w-24 -bottom-12 left-16 p-1 overflow-hidden border-1 rounded-full bg-background"
                        imageUrl={
                            typeof avatarImage === 'string'
                                ? avatarImage
                                : URL.createObjectURL(
                                      Array.from(avatarImage as FileList)[0]
                                  )
                        }
                        onEdit={() => avatarImageInputRef?.current?.click()}
                    />
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onFormSubmit)}
                        className="flex flex-col gap-3 pt-12"
                    >
                        <FormField
                            control={form.control}
                            name="avatarImage"
                            render={({
                                field: { value, onChange, ...fieldProps },
                            }) => (
                                // Hidden because a button will triger the file input using ref
                                <FormItem hidden={true}>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            ref={avatarImageInputRef}
                                            multiple={false}
                                            type="file"
                                            accept={ACCEPTED_IMAGE_TYPES.join(
                                                ','
                                            )}
                                            onChange={(event) => {
                                                // User has selected files
                                                if (
                                                    event.target.files &&
                                                    event.target.files.length >
                                                        0
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
                                                    onChange(newFiles)
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="backgroundImage"
                            render={({
                                field: { value, onChange, ...fieldProps },
                            }) => (
                                // Hidden because a button will triger the file input using ref
                                <FormItem hidden={true}>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            ref={backgroundImageInputRef}
                                            multiple={false}
                                            type="file"
                                            accept={ACCEPTED_IMAGE_TYPES.join(
                                                ','
                                            )}
                                            onChange={(event) => {
                                                // User has selected files
                                                if (
                                                    event.target.files &&
                                                    event.target.files.length >
                                                        0
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
                                                    onChange(newFiles)
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                maxLength={
                                                    MAX_DISPLAY_NAME_LENGTH
                                                }
                                            />
                                            <span className="absolute top-0 right-1 text-xs text-gray-500">
                                                {displayName?.length}/
                                                {MAX_DISPLAY_NAME_LENGTH}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <AutosizeTextarea
                                                minHeight={72}
                                                maxLength={MAX_BIO_LENGTH}
                                                className="resize-none pt-3"
                                                {...field}
                                            />
                                            <span className="absolute top-0 right-1 text-xs text-gray-500">
                                                {bio?.length}/{MAX_BIO_LENGTH}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                maxLength={MAX_LOCATION_LENGTH}
                                            />
                                            <span className="absolute top-0 right-1 text-xs text-gray-500">
                                                {location?.length}/
                                                {MAX_LOCATION_LENGTH}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button
                            ref={submitRef}
                            type="submit"
                            className="hidden"
                        />
                    </form>
                </Form>
            </div>
        )
    }
)

export default EditProfileForm
