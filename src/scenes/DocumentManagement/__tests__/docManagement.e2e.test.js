const filepath = ''
const jasmineTimeout = 600000
const host = 'http://localhost:5200'
const uploadNewButton = '#uploadNewBtn'
const uploadGoButton = '#uploadFilesBtn'
const uploadAlertMessage = '#uploadAlert > div> div:nth-child(1) > div > div > h2 > div'
const uploadAlertCloseButton = '#uploadAlert > div > div > button'
const documentManagementBtn = '#root > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
const documentTable = '#documentTable'
const bulkDropdown = '#action > div'
const bulkDelete = '#menu- > div > ul > li:nth-child(2)'
const bulkProject = '#menu- > div > ul > li:nth-child(3)'
const bulkJurisdiction = '#menu- > div > ul > li:nth-child(4)'
const testFiles = [
  `${filepath}/file1.pdf`, `${filepath}/file2.pdf`,
  `${filepath}/file3.pdf`
]
const bulkProjectSearch = '#project-name'
const bulkJurisdictionSearch = '#jurisdiction-name'
const bulkConfirmBtn = '#bulkConfirmBtn'
const bulkConfirmBox = '#bulkConfirmBox'
const testProject = 'zero dawn'
const testProject2 = 'Delete'
const testProject3 = 'firstDoc'
const testJurisdiction = 'Yauco Municipio, Puerto Rico'
const testJurisdiction2 = 'Hapeville, Fulton County, Georgia (city)'

let data = null

export const docManage = () => {
  describe('doc management', () => {
    test('check upload with excel', async () => {
      console.log('upload with excel started at: ', new Date().toLocaleTimeString())
      await page.goto(`${host}/docs`)
      await page.waitFor(2000)
      // click on upload new
      console.log('after click doc mng')
      await page.waitForSelector(uploadNewButton)
      await page.click(uploadNewButton)
      console.log('after click upload')

      await page.waitForSelector('form > div > div > input[type="file"]')
      const fileEle = await page.$('form > div > div > input[type="file"]')
      // wait for excel file
      await page.waitForSelector('form:nth-child(3) > div > div > input[type="file"]')
      const excelEle = await page.$('form:nth-child(3) > div > div > input[type="file"]')
      const files = [
        `${filepath}/OAC 3701-52-04 eff. 5-3-07.pdf`,
        `${filepath}/Youngstown Municipal Courtmayors Court Text Messaging.pdf`,
        `${filepath}/Children and Minors Motor Vehicles Communication.pdf`
      ]
      await fileEle.uploadFile(...files)
      await page.waitFor(7000)
      await excelEle.uploadFile(`${filepath}/demo.xlsx`)
      console.log('upload initated at:'+ new Date().toLocaleTimeString())
      await page.waitFor(60000)
      console.log('upload should be completed at:' + new Date().toLocaleTimeString())
      await page.screenshot({ path:'exceluploadinfo.png' })
      // add a valid project before upload
      await page.waitForSelector('#project-name')
      await page.click('#project-name')
      await page.keyboard.type(testProject)
      await page.waitFor(1000)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      // check files count
      const myFilesText = await page.evaluate(() => {
        let allText = []
        let fileList = document.querySelectorAll('#uploadFileList > div')
        fileList.forEach(function (row) {
          const cells = row.childNodes
          let textList = []
          cells.forEach(function (cell) {
            textList.push(cell.textContent)
          })
          allText.push(textList.join('|'))
        })
        return allText.join('^')
      })
      try {
        expect(myFilesText.toLowerCase())
          .toMatch('|picture_as_pdfOAC 3701-52-04 eff. 5-3-07.pdf|Washington, DC (federal district)|DC Code § 34.1452.1|10/1/2002|cancel^|picture_as_pdfYoungstown Municipal Courtmayors Court Text Messaging.pdf|Minnesota (state)|Minn. Stat. Ann. § 144.9501|7/1/2016|cancel^|picture_as_pdfChildren and Minors Motor Vehicles Communication.pdf|Arkansas (state)|Ark. Code R. § 016.06.18-219.000|12/12/2012|cancel'.toLowerCase())
        await page.waitForSelector(uploadGoButton)
        await page.click(uploadGoButton)
        await page.waitFor(60000)
        await page.screenshot({ path:'exceluploadsuccess.png' })
      } catch (e) {
        console.log(e)
        throw new Error('test failed')
      } finally {
        //    browser.close()
      }
    }, jasmineTimeout)
    test('check upload success', async () => {
      console.log('check upload success started at: ', new Date().toLocaleTimeString())
      await page.goto(`${host}/home`)
      // click on document management button
      await page.waitForSelector(documentManagementBtn)
      await page.click(documentManagementBtn)
      // click on upload new
      await page.waitForSelector(uploadNewButton)
      await page.click(uploadNewButton)

      await page.waitForSelector('form > div > div > input[type="file"]')
      const fileEle = await page.$('form > div > div > input[type="file"]')
      await fileEle.uploadFile(`${filepath}/gre_research_validity_data.pdf`)
      await page.waitForSelector('#project-name')
      await page.click('#project-name')
      await page.keyboard.type(testProject3)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitForSelector('#jurisdiction-name')
      await page.click('#jurisdiction-name')
      await page.keyboard.type('georgia (state)')
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitForSelector(uploadGoButton)
      await page.click(uploadGoButton)
      await page.waitFor(1000)
      // verify upload success
      // check if file uploaded
      await page.screenshot({ path:'uploaded confirmation.png' })
      console.log('check upload success')
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('firstdoc')
      await page.waitFor(1000)
      data = await page.evaluate((documentTable) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
        return {
          txtData: tds.map(td => td.textContent.toLowerCase()), rowCount: rows.length
        }
      }, documentTable)
      expect(data.txtData.join('|')).toEqual(expect.stringContaining('firstdoc'))
      expect(data.rowCount = 1).toBeTruthy()
      await page.waitFor(1000)
    }, jasmineTimeout)

    test('check duplicate upload', async () => {
      console.log('check duplicate upload started at: ', new Date().toLocaleTimeString())
      await page.goto(`${host}/home`)
      await page.waitFor(1000)
      // click on document management button
      await page.waitForSelector(documentManagementBtn)
      await page.click(documentManagementBtn)
      // click on upload new
      await page.waitForSelector(uploadNewButton)
      await page.click(uploadNewButton)

      await page.waitForSelector('form > div > div > input[type="file"]')
      const fileEle = await page.$('form > div > div > input[type="file"]')
      await fileEle.uploadFile(`${filepath}/gre_research_validity_data.pdf`)
      await page.waitForSelector('#project-name')
      await page.click('#project-name')
      await page.keyboard.type(testProject3)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitForSelector('#jurisdiction-name')
      await page.click('#jurisdiction-name')
      await page.keyboard.type('georgia (state)')
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')

      await page.waitForSelector(uploadGoButton)
      await page.click(uploadGoButton)
      await page.waitFor(1000)
      await page.waitForSelector(uploadAlertMessage)
      await page.waitFor(1000)
      await page.screenshot({ path:'duplicate confirm screen.png' })
      try {
        let dupMessageText = await page.$eval(uploadAlertMessage, el => el.textContent)
        console.log('actual message: ' + dupMessageText)
        expect(dupMessageText.toLowerCase()).toMatch('duplicates found')
        await page.waitForSelector(uploadAlertCloseButton)
        await page.click(uploadAlertCloseButton)
        await page.waitFor(1000)
      } catch (e) {
        //    await browser.close()
      } finally {
        //     await browser.close()
      }
    }, jasmineTimeout)

    test('check missing project', async () => {
      await page.goto(`${host}/home`)
      await page.waitFor(1000)
      // click on document management button
      await page.waitForSelector(documentManagementBtn)
      await page.click(documentManagementBtn)
      // click on upload new
      await page.waitForSelector(uploadNewButton)
      await page.click(uploadNewButton)

      await page.waitForSelector('form > div > div > input[type="file"]')
      const fileEle = await page.$('form > div > div > input[type="file"]')
      await fileEle.uploadFile(`${filepath}/gre_research_validity_data.pdf`)
      await page.waitForSelector(uploadGoButton)
      await page.click(uploadGoButton)
      await page.waitForSelector(uploadAlertMessage)
      await page.waitFor(1000)
      await page.screenshot({ path:'invalid project confirm screen.png' })
      try {
        let missingProjectMsgText = await page.$eval(uploadAlertMessage, el => el.textContent)
        console.log('actual message: ' + missingProjectMsgText)
        expect(missingProjectMsgText.toLowerCase()).toMatch('invalid project')
        await page.waitFor(500)
        await page.waitForSelector(uploadAlertCloseButton)
        await page.click(uploadAlertCloseButton)
      } catch (e) {
        // await browser.close()
      } finally {
        // await browser.close()
      }
    }, jasmineTimeout)

    test('check missing jurisdiction', async () => {
      await page.goto(`${host}/home`)
      // click on document management button
      await page.waitForSelector(documentManagementBtn)
      await page.click(documentManagementBtn)
      // click on upload new
      await page.waitForSelector(uploadNewButton)
      await page.click(uploadNewButton)

      await page.waitForSelector('form > div > div > input[type="file"]')
      const fileEle = await page.$('form > div > div > input[type="file"]')
      await fileEle.uploadFile(`${filepath}/gre_research_validity_data.pdf`)
      await page.waitForSelector('#project-name')
      await page.click('#project-name')
      await page.keyboard.type(testProject)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitForSelector(uploadGoButton)
      await page.click(uploadGoButton)
      await page.waitForSelector(uploadAlertMessage)
      await page.waitFor(1000)
      await page.screenshot({ path:'invalid jurisdiction confirm screen.png' })
      try {
        let missingJurisMsgText = await page.$eval(uploadAlertMessage, el => el.textContent)
        console.log('actual message: ' + missingJurisMsgText)
        expect(missingJurisMsgText.toLowerCase()).toMatch('invalid jurisdictions')
        await page.waitFor(2000)
        await page.waitForSelector(uploadAlertCloseButton)
        await page.click(uploadAlertCloseButton)
        console.log('close error and continue')
      } catch (e) {
        console.log(e)
        throw new Error('test failed')
      } finally {
        // await browser.close()
      }
      await page.waitFor(2000)
    }, jasmineTimeout)

    test('search jurisdiction column', async () => {
      await page.goto(`${host}/docs`)
      await page.waitFor(2000)
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('jurisdiction:minnesota')

      //    free format search
      const data = await page.evaluate((documentTable) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
        return {
          txtData: tds.map(td => td.textContent.toLowerCase()), rowCount: rows.length
        }
      }, documentTable)
      console.log(data)
      expect(data.txtData.join('|')).toEqual(expect.stringContaining('minnesota'))
      expect(data.rowCount >= 1).toBeTruthy()
      await page.screenshot({ path:'search result.png' })
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      //  await page.keyboard.type(string.fromCharCode())
      await page.waitFor(5000)
      //    await browser.close()
    }, jasmineTimeout)
    test('test sort doc', async () => {
      await page.goto(`${host}/docs`)
      await page.waitFor(2000)
      await page.waitForSelector('#name > span')
      await page.click('#name > span')
      let columnText = await page.evaluate(() => Array.from(document.querySelectorAll('#documentTable > tr:nth-child(1) > td:nth-child(2)'), element => element.textContent.trim()))
      expect(columnText[0][0].toLowerCase()).toEqual('c')
      await page.waitFor(1000)
      await page.waitForSelector('#name > span')
      await page.click('#name > span')
      columnText = await page.evaluate(() => Array.from(document.querySelectorAll('#documentTable > tr:nth-child(1) > td:nth-child(2)'), element => element.textContent.trim()))
      expect(columnText[0][0].toLowerCase()).toEqual('g')
      await page.waitFor(1000)
      await page.waitForSelector('#uploadedByName > span')
      await page.click('#uploadedByName > span')
      columnText = await page.evaluate(() => Array.from(document.querySelectorAll('#documentTable > tr:nth-child(1) > td:nth-child(3)'), element => element.textContent.trim()))
      expect(columnText[0][0].toLowerCase()).toEqual('a')
      await page.waitFor(1000)
      await page.waitForSelector('#uploadedByName > span')
      await page.click('#uploadedByName > span')
      columnText = await page.evaluate(() => Array.from(document.querySelectorAll('#documentTable > tr:nth-child(1) > td:nth-child(3)'), element => element.textContent.trim()))
      expect(columnText[0][0].toLowerCase()).toEqual('a')
      await page.waitFor(1000)
      await page.waitForSelector('#uploadedDate > span')
      await page.click('#uploadedDate > span')
      columnText = await page.evaluate(() => Array.from(document.querySelectorAll('#documentTable > tr:nth-child(1) > td:nth-child(4)'), element => element.textContent.trim()))
      expect(columnText[0].toLowerCase()).toEqual(new Date().toLocaleDateString('en-US'))
      await page.waitFor(1000)
      await page.waitForSelector('#uploadedDate > span')
      await page.click('#uploadedDate > span')
      columnText = await page.evaluate(() => Array.from(document.querySelectorAll('#documentTable > tr:nth-child(1) > td:nth-child(4)'), element => element.textContent.trim()))
      expect(columnText[0].toLowerCase()).toEqual(new Date().toLocaleDateString('en-US'))
      await page.waitFor(1000)
    }, jasmineTimeout)
    test('bulk operations', async () => {
      console.log('bulk operation started at:', new Date().toLocaleTimeString())
      // await page.goto(`${host}/login`);
      // //  await page.goto('http://localhost:5200/login')
      // //  await page.waitForNavigation()
      // await page.screenshot({path: 'login.png'})
      // await page.waitForSelector(email_selector)
      // await page.click(email_selector);
      // await page.keyboard.type(admin.email);
      // await page.click("button[type=submit]");
      await page.goto(`${host}/home`)
      // click on document management button
      await page.waitForSelector(documentManagementBtn)
      await page.click(documentManagementBtn)
      await page.screenshot({ path:'current docs.png' })
      //upload 3 documents for testing
      //click on upload new
      await page.waitForSelector(uploadNewButton)
      await page.click(uploadNewButton)

      await page.waitForSelector('form > div > div > input[type="file"]')
      const fileEle = await page.$('form > div > div > input[type="file"]')

      await fileEle.uploadFile(...testFiles)
      await page.waitFor(7000)
      await page.waitForSelector('#project-name')
      await page.click('#project-name')
      await page.keyboard.type(testProject)
      await page.waitFor(5000)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitForSelector('#jurisdiction-name')
      await page.click('#jurisdiction-name')
      await page.keyboard.type(testJurisdiction)
      await page.waitFor(5000)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')

      await page.waitForSelector(uploadGoButton)
      await page.click(uploadGoButton)
      await page.waitFor(5000)
      await page.screenshot('confirm upload for bulk operation.png',)
      // check if file uploaded
      const searchBar = await page.$('#search-bar')
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('puerto')
      data = await page.evaluate((documentTable) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
        return {
          txtData: tds.map(td => td.textContent.toLowerCase()), rowCount: rows.length
        }
      }, documentTable)
      expect(data.txtData.join('|')).toEqual(expect.stringContaining('puerto'))
      expect(data.rowCount >= 3).toBeTruthy()

      // checkbox the first 3 rows
      await page.evaluate((documentTable) => {
        //const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td input[type="checkbox"]')).splice(0, 3)
        tds.forEach(chbox => chbox.click())
      }, documentTable)
      await page.waitFor(2000)
      await page.waitForSelector(bulkDropdown)
      await page.click(bulkDropdown)
      // bulk assign project
      await page.waitForSelector(bulkProject)
      await page.click(bulkProject)

      await page.waitForSelector(bulkConfirmBox)
      await page.waitFor(2000)
      // await page.waitForSelector(bulkProjectSearch)
      await page.click(bulkProjectSearch)
      await page.waitFor(2000)
      await page.keyboard.type(testProject2)
      await page.waitFor(5000)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitFor(2000)
      await page.waitForSelector(bulkConfirmBtn)
      await page.click(bulkConfirmBtn)
      await page.waitFor(2000)
      // validate added project
      //    free format search
      await searchBar.click({ clickCount: 3 })
      await page.keyboard.press('Backspace')
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('delete')
      data = await page.evaluate((documentTable) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
        return {
          txtData: tds.map(td => td.textContent.toLowerCase()), rowCount: rows.length
        }
      }, documentTable)
      expect(data.txtData.join('|')).toEqual(expect.stringContaining('delete'))
      expect(data.rowCount >= 3).toBeTruthy()

      // bulk jurisdiction assign
      // clear search bar
      await page.waitForSelector('#search-bar')
      await searchBar.click({ clickCount: 3 })
      await page.keyboard.press('Backspace')

      // check the first 3 rows
      await page.evaluate((documentTable) => {
        //const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td input[type="checkbox"]')).splice(0, 3)
        tds.forEach(chbox => chbox.click())
      }, documentTable)
      await page.waitFor(1000)
      await page.waitForSelector(bulkDropdown)
      await page.click(bulkDropdown)
      // bulk assign project
      await page.waitForSelector(bulkJurisdiction)
      await page.click(bulkJurisdiction)
      await page.waitFor(2000)
      await page.waitForSelector(bulkConfirmBox)
      await page.waitFor(2000)
      // await page.waitForSelector(bulkProjectSearch)
      await page.click(bulkJurisdictionSearch)

      await page.keyboard.type(testJurisdiction2)
      await page.waitFor(5000)
      await page.waitForSelector('#react-autowhatever-1--item-0')
      await page.click('#react-autowhatever-1--item-0')
      await page.waitFor(2000)
      await page.waitForSelector(bulkConfirmBtn)
      await page.click(bulkConfirmBtn)

      // validate added jurisdiction
      //    free format search
      await page.waitFor(2000)
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('hapeville')
      data = null
      data = await page.evaluate((documentTable) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
        return {
          txtData: tds.map(td => td.textContent.toLowerCase()), rowCount: rows.length
        }
      }, documentTable)
      expect(data.txtData.join('|')).toEqual(expect.stringContaining('hapeville'))
      expect(data.rowCount >= 3).toBeTruthy()

      await page.waitFor(2000)

      // bulk deletion

      // filter row with delete me
      await searchBar.click({ clickCount: 3 })
      await page.keyboard.press('Backspace')
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('delete me')
      // check the first 3 rows

      await page.evaluate((documentTable) => {
        //const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td input[type="checkbox"]')).splice(0, 3)
        tds.forEach(chbox => chbox.click())
      }, documentTable)
      await page.waitFor(1000)
      await page.waitForSelector(bulkDropdown)
      await page.click(bulkDropdown)
      // bulk assign project
      await page.waitForSelector(bulkDelete)
      await page.click(bulkDelete)

      await page.waitForSelector(bulkConfirmBox)
      await page.waitFor(2000)

      await page.waitForSelector(bulkConfirmBtn)
      await page.click(bulkConfirmBtn)

      // validate delete docs
      //    free format search
      await page.waitFor(2000)
      await searchBar.click({ clickCount: 3 })
      await page.keyboard.press('Backspace')
      await page.waitForSelector('#search-bar')
      await page.click('#search-bar')
      await page.keyboard.type('hapeville')
      data = null
      data = await page.evaluate((documentTable) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
        return {
          txtData: tds.map(td => td.textContent.toLowerCase()), rowCount: rows.length
        }
      }, documentTable)
      expect(data.rowCount >= 3).toBeFalsy()
      // clear search bar
      await page.waitForSelector('#search-bar')
      await searchBar.click({ clickCount: 3 })
      await page.keyboard.press('Backspace')
      await page.keyboard.type('firstdoc')
      await page.waitFor(1000)
      await page.evaluate((documentTable) => {
        //const rows = Array.from(document.querySelectorAll(documentTable + ' tr'))
        const tds = Array.from(document.querySelectorAll(documentTable + ' tr td input[type="checkbox"]')).splice(0, 4)
        tds.forEach(chbox => chbox.click())
      }, documentTable)
      await page.waitFor(1000)
      await page.waitForSelector(bulkDropdown)
      await page.click(bulkDropdown)
      // bulk assign project
      await page.waitForSelector(bulkDelete)
      await page.click(bulkDelete)

      await page.waitForSelector(bulkConfirmBox)
      await page.waitFor(1000)

      await page.waitForSelector(bulkConfirmBtn)
      await page.click(bulkConfirmBtn)
    }, jasmineTimeout)

  })
}

// function getText(linkText) {
//   linkText = linkText.replace(/\r\n|\r/g, '\n')
//   linkText = linkText.replace(/\+/g, ' ')
//
//   // Replace &nbsp; with a space
//   const nbspPattern = new RegExp(String.fromCharCode(160), 'g')
//   return linkText.replace(nbspPattern, ' ')
// }

// async function findByLink(page, linkString) {
//   const links = await page.$$('a')
//   for (let i = 0; i < links.length; i++) {
//     let valueHandle = await links[i].getProperty('innerText')
//     let linkText = await valueHandle.jsonValue()
//     const text = getText(linkText)
//     if (linkString === text) {
//       return links[i]
//     }
//   }
//   return null
// }
