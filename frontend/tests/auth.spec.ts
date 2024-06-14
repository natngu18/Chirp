import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Uses Firebase auth emulator
if (process.env.VITE_NODE_ENV === 'development') {
    // Login to the default user before each test
    test.beforeEach(async ({ page }) => {
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

        await page1.locator('#email-input').pressSequentially('nat@gmail.com')

        await page1.locator('#email-input').press('Tab')

        await page1.locator('#display-name-input').pressSequentially('nathan')

        await page1.locator('#screen-name-input').click()

        await page1.locator('#screen-name-input').pressSequentially('nathan')
        await page1
            .getByRole('button', { name: 'Sign in with Google.com' })
            .click()
        await page.waitForNavigation()
        expect(page.url()).toBe('http://localhost:5173/')
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
        await expect(
            page.getByPlaceholder('What are you thinking?')
        ).toBeVisible({ timeout: 15000 })
    })

    test("Create post with random text, verify it exists in default user's posts", async ({
        page,
    }) => {
        const randomText = faker.lorem.words(5)
        await page.getByPlaceholder('What are you thinking?').click()
        await page
            .getByPlaceholder('What are you thinking?')
            .pressSequentially(randomText)
        await page.getByRole('button', { name: 'Post' }).click({ delay: 300 })
        await page.getByRole('link', { name: 'Profile' }).click({ delay: 300 })
        await expect(page.getByLabel('Posts')).toContainText(randomText, {
            timeout: 25000,
        })
        await expect(page.getByText('nathan').first()).toBeVisible()
        await expect(page.getByText('@nat').first()).toBeVisible()
        await expect(page.getByRole('heading', { name: 'nat' })).toBeVisible()
    })

    test('Create post with random text and image, verify it is searchable with subset of text', async ({
        page,
    }) => {
        test.setTimeout(100000)
        const randomText = faker.lorem.words(5)

        //  Upload image
        const filePath = path.join(__dirname, './fixtures/Picture1.jpg')
        // Set the input files
        await page.setInputFiles('input[type=file]', filePath)

        await page
            .getByPlaceholder('What are you thinking?')
            .pressSequentially(randomText)

        await page.getByRole('button', { name: 'Post' }).click()

        // Wait for Elasticsearch to index the post
        await page.waitForTimeout(60000) // Wait for 60 seconds

        await page.getByPlaceholder('Search').click()
        // Use random word from the random text as search term
        const words = randomText.split(' ')
        const randomIndex = Math.floor(Math.random() * words.length)
        const randomWord = words[randomIndex]
        await page.getByPlaceholder('Search').fill(randomWord)
        await page.getByPlaceholder('Search').press('Enter')

        // Bold text should contain the random word
        await expect(page.getByRole('strong')).toContainText(randomWord, {
            timeout: 25000,
        })

        // Uploaded image should be visible
        const button = await page.getByRole('button', {
            name: 'post-image-button',
        })
        expect(await button.isVisible()).toBeTruthy()
    })

    test('Default user and search option for inputted text appears in searchbar options', async ({
        page,
    }) => {
        test.setTimeout(100000)
        await page.waitForTimeout(60000) // Wait for 60 seconds
        await page.getByPlaceholder('Search').click()
        await page.getByPlaceholder('Search').pressSequentially('nat')
        await expect(
            page.getByRole('option', { name: 'Search for "nat"' })
        ).toBeVisible()
        await expect(
            page.getByRole('option', { name: 'nat nathan @nat' })
        ).toBeVisible({ timeout: 25000 })
    })
}
