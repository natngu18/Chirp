import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
    firebaseEmulatorLoginSetup,
    loginToExistingUserSetup,
} from './login.setup'
import { TEST_USER } from './config/user-config'

// Uses Firebase auth emulator
if (process.env.VITE_NODE_ENV === 'development') {
    test.beforeEach(async ({ page }) => {
        await firebaseEmulatorLoginSetup(page)
    })
} else {
    test.beforeEach(async ({ page }) => {
        await loginToExistingUserSetup(page)
    })
}

test("should show created post in default user's profile page", async ({
    page,
}) => {
    const randomText = faker.lorem.words(5)
    await page.getByPlaceholder('What are you thinking?').click()
    await page
        .getByPlaceholder('What are you thinking?')
        .pressSequentially(randomText)
    await page
        .getByRole('button', { name: 'Post', exact: true })
        .click({ delay: 300 })
    await page.getByRole('link', { name: 'Profile' }).click({ delay: 5000 })
    await expect(page.getByLabel('Posts')).toContainText(randomText, {
        timeout: 25000,
    })
    await expect(page.locator('#root')).toContainText(TEST_USER.username)
    await expect(page.locator('#root')).toContainText(TEST_USER.displayName)

    await expect(
        page.getByRole('heading', { name: TEST_USER.username })
    ).toBeVisible()
})
test.describe('User profile tabs', () => {
    test('should switch url when navigating tabs and go back to home page when clicking back button', async ({
        page,
    }) => {
        await page.getByRole('link', { name: 'Profile' }).click()
        const profileUrl = `http://localhost:5173/profile/${TEST_USER.username}`
        expect(page.url()).toBe(profileUrl)
        await page.getByRole('tab', { name: 'Replies' }).click()
        expect(page.url()).toBe(profileUrl + `/replies`)
        await page.getByRole('tab', { name: 'Media' }).click()
        expect(page.url()).toBe(profileUrl + `/media`)
        await page.getByRole('tab', { name: 'Likes' }).click()
        expect(page.url()).toBe(profileUrl + `/likes`)
        await page.getByLabel('Back button').click()
        expect(page.url()).toBe(`http://localhost:5173/`)
    })
})

test('should display liked post in user likes tabs (create post via post modal)', async ({
    page,
}) => {
    const randomText = faker.lorem.words(10)

    await page.getByRole('link', { name: 'Profile' }).click()
    await page.getByLabel('Create post modal').click()
    await page.getByPlaceholder('What are you thinking?').click({ delay: 1500 })
    await page
        .getByPlaceholder('What are you thinking?')
        .pressSequentially(randomText)
    await page.getByRole('button', { name: 'Post' }).click()
    // View post via toast
    await page.getByRole('button', { name: 'View' }).click()
    // Wait for navigation and post to load
    expect(page.url()).toContain('http://localhost:5173/post/')
    await page.waitForTimeout(2500)
    await page.getByLabel('Like post').click()
    await expect(page.getByLabel('Unlike post')).toBeVisible()
    await expect(page.getByLabel('Unlike post')).toContainText('1')
    await page.getByRole('link', { name: 'Profile' }).click()
    await page.getByRole('tab', { name: 'Likes' }).click()
    await expect(page.getByLabel('Post text').nth(0)).toContainText(randomText)
    //Unlike
    await page.getByLabel('Unlike post').nth(0).click()
    const firstPostLikeButtonLocator = page.getByLabel('Like post').nth(0)
    await expect(firstPostLikeButtonLocator).toBeVisible()
    await expect(firstPostLikeButtonLocator).toContainText('0')
})
test.describe('Edit profile', () => {
    test('should display bio and location after edit', async ({ page }) => {
        const bio = faker.lorem.sentence()
        const location = faker.location.city()
        await page.getByRole('link', { name: 'Profile' }).click()
        await page.getByRole('button', { name: 'Edit profile' }).click()
        await page.locator('textarea[name="bio"]').click()
        await page.locator('textarea[name="bio"]').fill(bio)
        await page.locator('input[name="location"]').click()
        await page.locator('input[name="location"]').fill(location)
        await page.getByRole('button', { name: 'Save' }).click()

        await expect(page.getByLabel('User bio')).toContainText(bio, {
            timeout: 15000,
        })
        await expect(page.getByLabel('User location')).toContainText(location, {
            timeout: 15000,
        })
    })
})
