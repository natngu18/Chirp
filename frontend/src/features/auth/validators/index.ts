import { z } from 'zod'

export const passwordSchema = z
    .string()
    .trim()
    .min(6, {
        message: 'Password must be at least 6 characters.',
    })
    .max(50, {
        message: 'Password must be less than 50 characters.',
    })

export const emailSchema = z
    .string()
    .trim()
    .email('Must be a valid email.')
    .min(5, {
        message: 'Email must be at least 5 characters.',
    })
    .max(50, {
        message: 'Email must be less than 50 characters.',
    })
