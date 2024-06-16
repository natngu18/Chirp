import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import {
    firebaseEmulatorLoginSetup,
    loginToExistingUserSetup,
} from './login.setup'
import { TEST_USER } from './config/user-config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
if (process.env.VITE_NODE_ENV === 'development') {
    test.beforeEach(async ({ page }) => {
        await firebaseEmulatorLoginSetup(page)
    })
} else {
    test.beforeEach(async ({ page }) => {
        await loginToExistingUserSetup(page)
    })
}
test('should show created post with image in search results where search term is subset of post text', async ({
    page,
}) => {
    test.setTimeout(90000)
    const randomText = faker.lorem.words(5)

    //  Upload image
    const filePath = path.join(__dirname, './fixtures/Picture1.jpg')
    // Set the input files
    await page.setInputFiles('input[type=file]', filePath)

    await page
        .getByPlaceholder('What are you thinking?')
        .pressSequentially(randomText)

    await page.getByRole('button', { name: 'Post', exact: true }).click()
    await page.getByPlaceholder('Search').click()
    // Use random word from the random text as search term
    const words = randomText.split(' ')
    const randomIndex = Math.floor(Math.random() * words.length)
    const randomWord = words[randomIndex]
    await page.getByPlaceholder('Search').fill(randomWord)
    await page.getByPlaceholder('Search').press('Enter') // Redirects to search page

    // Retry until post is visible in search results or time out
    // (can take a while for the post to be indexed by Elasticsearch)
    await expect(async () => {
        // reload search page
        await page.reload()
        // Bold text should contain the random word
        await expect(page.getByRole('strong')).toContainText(randomWord, {
            timeout: 25000,
        })

        // Uploaded image should be visible
        const button = await page.getByRole('button', {
            name: 'post-image-button',
        })
        expect(await button.isVisible()).toBeTruthy()
    }).toPass({
        intervals: [5_000, 10000, 20000, 40000, 60000, 80000],
        timeout: 90000,
    })
})
test('should show default user and option for inputted text in searchbar options', async ({
    page,
}) => {
    test.setTimeout(90000)

    // Retry until user is visible in search results or time out
    // (can take a while for the user to be indexed by Elasticsearch)
    await expect(async () => {
        await page.reload() // Reload page to clear react query cache
        await page.getByPlaceholder('Search').click()
        await page
            .getByPlaceholder('Search')
            .pressSequentially(TEST_USER.username)
        await expect(
            page.getByRole('option', {
                name: `Search for "${TEST_USER.username}"`,
            })
        ).toBeVisible()
        await expect(page.getByRole('group')).toContainText(
            TEST_USER.username,
            {
                timeout: 25000,
            }
        )
        await expect(page.getByRole('group')).toContainText(
            TEST_USER.displayName,
            {
                timeout: 25000,
            }
        )
    }).toPass({
        intervals: [5_000, 10000, 20000, 40000, 60000, 80000],
        timeout: 90000,
    })
})
