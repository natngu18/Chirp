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
    await page.getByRole('button', { name: 'Post' }).click({ delay: 300 })
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

// test.describe('Edit profile', () => {
//     test('should display the current number of todo items', async ({
//         page,
//     }) => {
//         // create a new todo locator
//         const newTodo = page.getByPlaceholder('What needs to be done?')

//         // create a todo count locator
//         const todoCount = page.getByTestId('todo-count')

//         await newTodo.fill(TODO_ITEMS[0])
//         await newTodo.press('Enter')

//         await expect(todoCount).toContainText('1')

//         await newTodo.fill(TODO_ITEMS[1])
//         await newTodo.press('Enter')
//         await expect(todoCount).toContainText('2')

//         await checkNumberOfTodosInLocalStorage(page, 2)
//     })
// })
