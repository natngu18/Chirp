import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function arrayToFileList(filesArray: File[]) {
    const dataTransfer = new DataTransfer()
    filesArray.forEach((file) => dataTransfer.items.add(file))
    return dataTransfer.files
}
