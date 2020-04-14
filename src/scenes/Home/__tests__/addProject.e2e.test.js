const admin = { email: 'test@test.test' }
const email_selector = '#email'
const host = 'http://localhost:5200'
//const errorMsg = 'body > div > div > form > div > div > div:nth-child(1) > div > p'
const addProjectButton = '#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a'

// find the link, by going over all links on the page
export const addProject = () => {
  describe('Project Creation', () => {
    const date = new Date().toLocaleTimeString()
    test('add new project', async () => {
      await page.goto(`${host}/login`)
      await page.click(email_selector)
      await page.keyboard.type(admin.email)
      await page.click('button[type=submit]')
      await page.waitForNavigation()

      // Add project button
      await page.waitForSelector(addProjectButton)
      await page.click(addProjectButton)
      await page.waitForNavigation()
      await page.waitForSelector('body > div > div > form', { visible: true })
      const name = await page.$('input[name="name"]')
      await name.click()
      await page.type('input[name="name"]', `Project - ${date}`)
      const button = '#modal-action-1'
      await page.waitForSelector(button)
      await page.click(button)
      await page.waitForNavigation()

      const projectTxt = await findByLink(page, `Project - ${date}`)
      expect(projectTxt).not.toBe(null)
    }, 600000)

    test('add project firstDoc if needed', async () => {
      //await page.goto(`${host}/home`)
      //    await page.waitForNavigation()
      await page.waitForSelector(addProjectButton)
      await page.click(addProjectButton)
      await page.waitForNavigation()
      await page.waitForSelector('body > div > div > form', { visible: true })
      const name2 = await page.$('input[name="name"]')
      await name2.click()
      await name2.type(`FirstDoc`)
      const button = '#modal-action-1'
      await page.waitForSelector(button)
      await page.click(button)
      await page.waitFor(2000)
    }, 600000)

    test('add project zero dawn if needed', async () => {
      // await page.waitForNavigation()
      // check if project already exists
      await page.waitForSelector(addProjectButton)
      await page.click(addProjectButton)
      //  await page.waitForNavigation()

      await page.waitForSelector('body > div > div > form', { visible: true })
      const name3 = await page.$('input[name="name"]')
      await name3.click()
      await name3.type(`Zero dawn`)
      const button = '#modal-action-1'
      await page.waitForSelector(button)
      await page.click(button)
    }, 600000)

    test('add project delete for bulk operation test', async () => {
      // await page.waitForNavigation()
      // check if project already exists
      await page.waitForSelector(addProjectButton)
      await page.click(addProjectButton)
      //  await page.waitForNavigation()

      await page.waitForSelector('body > div > div > form', { visible: true })
      const name3 = await page.$('input[name="name"]')
      await name3.click()
      await name3.type('delete')
      const button = '#modal-action-1'
      await page.waitForSelector(button)
      await page.click(button)
    }, 600000)
  })
}

function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, '\n')
  linkText = linkText.replace(/\+/g, ' ')

  // Replace &nbsp; with a space
  const nbspPattern = new RegExp(String.fromCharCode(160), 'g')
  return linkText.replace(nbspPattern, ' ')
}

async function findByLink(page, linkString) {
  const links = await page.$$('a')
  for (let i = 0; i < links.length; i++) {
    let valueHandle = await links[i].getProperty('innerText')
    let linkText = await valueHandle.jsonValue()
    const text = getText(linkText)
    if (linkString === text) {
      return links[i]
    }
  }
  return null
}
