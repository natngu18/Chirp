import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Convert an array of files to a FileList
export function arrayToFileList(filesArray: File[]) {
    const dataTransfer = new DataTransfer()
    filesArray.forEach((file) => dataTransfer.items.add(file))
    return dataTransfer.files
}

// Convert a file size in bytes to megabytes
export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
    const result = sizeInBytes / (1024 * 1024)
    return +result.toFixed(decimalsNum)
}
