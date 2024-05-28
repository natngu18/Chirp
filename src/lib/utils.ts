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

import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
export const formatInTimeZone = (date: number | Date, fmt: string) =>
    format(
        utcToZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone),
        fmt
    )

import {
    parseISO,
    differenceInHours,
    differenceInYears,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns'

export function formatPostUtcDate(dateString: string) {
    const date = parseISO(`${dateString}Z`)
    const now = new Date()

    const secondsDifference = differenceInSeconds(now, date)
    const minutesDifference = differenceInMinutes(now, date)
    const hoursDifference = differenceInHours(now, date)
    const yearsDifference = differenceInYears(now, date)

    if (secondsDifference < 60) {
        return `${secondsDifference}s`
    } else if (minutesDifference < 60) {
        return `${minutesDifference}m`
    } else if (hoursDifference < 24) {
        return `${hoursDifference}h`
    } else if (yearsDifference < 1) {
        return format(date, 'MMM d')
    } else {
        return format(date, 'MMM d, yyyy')
    }
}

export const capitalize = <T extends string>(s: T) =>
    (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>
