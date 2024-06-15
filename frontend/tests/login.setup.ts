import { Page, expect } from '@playwright/test'
import { TEST_USER } from './config/user-config'

export async function firebaseEmulatorLoginSetup(page: Page) {
    await page.goto('http://localhost:5173/login')
    const page1Promise = page.waitForEvent('popup')
    await page
        .getByRole('button', { name: 'Sign In with Google' })
        .click({ delay: 300 })
    const page1 = await page1Promise
    await page1
        .getByRole('button', { name: 'Add new account' })
        .click({ delay: 300 })
    await await page1.locator('#email-input').click({ delay: 300 })
    await page1.locator('#email-input').pressSequentially(TEST_USER.email)
    await page1.locator('#email-input').press('Tab')
    await page1.getByRole('button', { name: 'Sign in with Google.com' }).click()
    await page.waitForNavigation()
    expect(page.url()).toBe('http://localhost:5173/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
    await expect(page.getByPlaceholder('What are you thinking?')).toBeVisible({
        timeout: 15000,
    })
}

export async function loginToExistingUserSetup(page: Page) {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Email').click()
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await page.waitForNavigation()
    expect(page.url()).toBe('http://localhost:5173/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
    await expect(page.getByPlaceholder('What are you thinking?')).toBeVisible({
        timeout: 15000,
    })
}
