//const puppeteer = require('puppeteer')

const jasmineTimeout = 60000
const admin = {
  email: 'test@test.test'
}
const email_selector = '#email'
const host = 'http://localhost:5200'
const documentManagementBtn = '#root > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
const documentTable = '#documentTable'
const refDocMeta = {
  docName: 'Youngstown Municipal Courtmayors Court Text Messaging.pdf',
  uploadedDate: new Date().toLocaleDateString('en-US'),
  uploadedBy: 'Admin',
  citation: 'Minn. Stat. Ann. § 144.9501',
  effDate: '7/1/2016'
}

const docName = '#docName'
const docMeta = '#docMeta'

export const docView = () => {
  describe('doc view', () => {
    // dummy test.  run login for the rest of the tests
    test('login', async () => {
      jest.setTimeout(80000)
      await page.goto(`${host}/login`)
      await page.screenshot({ path: 'login.png' })
      await page.waitForSelector(email_selector)
      await page.click(email_selector)
      await page.keyboard.type(admin.email)
      await page.click('button[type=submit]')
      await page.waitForNavigation()
    }, jasmineTimeout)

    test('check if document open', async () => {
      await page.goto(`${host}/home`)
      // click on document management button
      await page.waitForSelector(documentManagementBtn)
      await page.click(documentManagementBtn)
      await page.waitFor(1000)
      await page.waitForSelector(documentTable)
      try {
        await page.evaluate((refDocMeta) => {
          let docLinks = document.querySelectorAll('#documentTable a')
          docLinks.forEach(link => {
            let el = link.parentElement.querySelector('a')
            if (el.innerText === refDocMeta.docName) {
              el.click()
            }
          })
        }, refDocMeta)
        await page.waitFor(5000)
        await page.waitForSelector(docName)
        expect(await page.$eval(docName, (element) => {
          return element.innerText.toLowerCase()
        })).toMatch(refDocMeta.docName.toLowerCase())
        const docMetaText = await page.$eval(docMeta, (element) => {
          return element.innerText.toLowerCase()
        })
        Object.keys(refDocMeta).forEach((key) => {
          if (key !== 'docName') {
            expect(docMetaText.toLowerCase()).toEqual(expect.stringContaining(refDocMeta[key].toLowerCase()))
          }
        })
      } catch (e) {
        console.log(e)
        throw new Error('test failed')
      } finally {
        // browser.close()
      }
    }, jasmineTimeout)
  })
}
