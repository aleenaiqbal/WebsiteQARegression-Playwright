const { test, expect } = require('@playwright/test');

const { readWebsites } = require('../utils/excelReader');
const WebsitePage = require('../pages/WebsitePage');
const { checkLinks } = require('../utils/linkChecker');
const { generateExcelReport } = require('../utils/excelReport');


// ============================================================
// READ WEBSITES FROM EXCEL
// ============================================================

const websites = readWebsites();


// ============================================================
// STORE RESULTS
// ============================================================

const results = [];


// ============================================================
// CREATE TEST FOR EACH WEBSITE
// ============================================================

for (const website of websites) {

    // Only test websites where HealthCheck = Yes

    if (
        String(website.HealthCheck).toLowerCase() !== 'yes'
    ) {
        continue;
    }


    test(
        `Health Check - ${website.SiteName}`,
        async ({ page }) => {


            // =================================================
            // PAGE OBJECT
            // =================================================

            const websitePage = new WebsitePage(page);


            // =================================================
            // VARIABLES
            // =================================================

            let httpStatus = 'N/A';

            let loadTime = 'N/A';

            let title = 'N/A';

            let totalLinks = 0;

            let brokenLinks = 0;

            let warningLinks = 0;

            let brokenLinkUrls = '';

            let warningLinkUrls = '';

            let consoleErrors = 0;

            let consoleErrorMessages = '';

            let websiteStatus = 'FAIL';

            let failureReason = '';


            // =================================================
            // CONSOLE ERRORS
            // =================================================

            const consoleErrorsList = [];


            page.on(
                'console',
                message => {

                    if (
                        message.type() === 'error'
                    ) {

                        const errorMessage =
                            message.text();

                        consoleErrorsList.push(
                            errorMessage
                        );

                        console.log(
                            `⚠️ Console Error: ${errorMessage}`
                        );

                    }

                }
            );


            // =================================================
            // START TEST
            // =================================================

            console.log('\n========================================');

            console.log(
                `Testing: ${website.SiteName}`
            );

            console.log(
                `URL: ${website.URL}`
            );

            console.log(
                '========================================');


            try {


                // =============================================
                // 1. OPEN WEBSITE
                // =============================================

                const result =
                    await websitePage.open(
                        website.URL
                    );


                loadTime =
                    result.loadTime;


                httpStatus =
                    result.response
                        ? result.response.status()
                        : 'NO RESPONSE';


                console.log(
                    `HTTP Status: ${httpStatus}`
                );


                console.log(
                    `Page Load Time: ${loadTime} ms`
                );


                // =============================================
                // 2. PAGE TITLE
                // =============================================

                title =
                    await websitePage.getTitle();


                console.log(
                    `Page Title: ${title}`
                );


                // =============================================
                // 3. MAIN WEBSITE VALIDATION
                // =============================================

                expect(
                    result.response
                ).not.toBeNull();


                expect(
                    httpStatus
                ).toBeGreaterThanOrEqual(200);


                expect(
                    httpStatus
                ).toBeLessThan(400);


                expect(
                    title.trim()
                ).not.toBe('');


                // =============================================
                // 4. GET ALL LINKS
                // =============================================

                const links =
                    await websitePage.getLinks();


                totalLinks =
                    links.length;


                console.log(
                    `Total Links Found: ${totalLinks}`
                );


                // =============================================
                // 5. CHECK ALL LINKS
                // =============================================

                const linkResults =
                    await checkLinks(
                        page.request,
                        links
                    );


                // =============================================
                // 6. BROKEN LINKS
                // =============================================

                const brokenLinkResults =
                    linkResults.filter(
                        link =>
                            link.result === 'FAIL'
                    );


                brokenLinks =
                    brokenLinkResults.length;


                brokenLinkUrls =
                    brokenLinkResults
                        .map(
                            link =>
                                `${link.status} | ${link.url}`
                        )
                        .join('\n');


                // =============================================
                // 7. WARNING LINKS
                // =============================================

                const warningLinkResults =
                    linkResults.filter(
                        link =>
                            link.result === 'WARNING'
                    );


                warningLinks =
                    warningLinkResults.length;


                warningLinkUrls =
                    warningLinkResults
                        .map(
                            link =>
                                `${link.status} | ${link.url} | ${link.category}`
                        )
                        .join('\n');


                // =============================================
                // 8. DISPLAY BROKEN LINKS
                // =============================================

                console.log(
                    `Broken Links: ${brokenLinks}`
                );


                if (brokenLinks > 0) {

                    console.log(
                        '\n❌ Broken Links Found:'
                    );


                    for (
                        const link
                        of brokenLinkResults
                    ) {

                        console.log(
                            `- ${link.status} | ${link.url}`
                        );

                    }

                }
                else {

                    console.log(
                        '✅ No broken links found'
                    );

                }


                // =============================================
                // 9. DISPLAY WARNING LINKS
                // =============================================

                console.log(
                    `Links Needing Review: ${warningLinks}`
                );


                if (warningLinks > 0) {

                    console.log(
                        '\n⚠️ Links Needing Review:'
                    );


                    for (
                        const link
                        of warningLinkResults
                    ) {

                        console.log(
                            `- ${link.status} | ${link.url} | ${link.category}`
                        );

                    }

                }


                // =============================================
                // 10. WAIT FOR JAVASCRIPT
                // =============================================

                await page.waitForTimeout(2000);


                // =============================================
                // 11. CONSOLE ERROR RESULTS
                // =============================================

                consoleErrors =
                    consoleErrorsList.length;


                consoleErrorMessages =
                    consoleErrorsList.join('\n');


                console.log(
                    `Console Errors: ${consoleErrors}`
                );


                if (
                    consoleErrors > 0
                ) {

                    console.log(
                        '\n⚠️ Console Errors Found:'
                    );


                    consoleErrorsList.forEach(
                        (error, index) => {

                            console.log(
                                `${index + 1}. ${error}`
                            );

                        }
                    );

                }
                else {

                    console.log(
                        '✅ No console errors found'
                    );

                }


                // =============================================
                // 12. WEBSITE STATUS
                // =============================================

                websiteStatus = 'PASS';


                console.log(
                    `\n✅ ${website.SiteName} - PASS`
                );


            }

            catch (error) {


                // =============================================
                // TEST FAILED
                // =============================================

                websiteStatus = 'FAIL';


                failureReason =
                    error.message;


                console.log(
                    `\n❌ ${website.SiteName} - FAIL`
                );


                console.log(
                    `Reason: ${failureReason}`
                );


                // =============================================
                // FAILURE SCREENSHOT
                // =============================================

                try {

                    const screenshotName =
                        `${website.SiteName.replace(
                            /[^a-z0-9]/gi,
                            '_'
                        )}_FAILED.png`;


                    await page.screenshot({

                        path:
                            `screenshots/${screenshotName}`,

                        fullPage: true

                    });


                    console.log(
                        `📸 Screenshot saved: screenshots/${screenshotName}`
                    );

                }

                catch (
                    screenshotError
                ) {

                    console.log(
                        `⚠️ Could not save screenshot: ${screenshotError.message}`
                    );

                }

            }


            // =================================================
            // FINAL CONSOLE ERROR DATA
            // =================================================

            consoleErrors =
                consoleErrorsList.length;


            consoleErrorMessages =
                consoleErrorsList.join('\n');


            // =================================================
            // ADD RESULT TO EXCEL
            // =================================================

            results.push({

                'Site Name':
                    website.SiteName,

                'URL':
                    website.URL,

                'HTTP Status':
                    httpStatus,

                'Page Load Time (ms)':
                    loadTime,

                'Page Title':
                    title,

                'Total Links':
                    totalLinks,

                'Broken Links':
                    brokenLinks,

                'Broken Link URLs':
                    brokenLinkUrls,

                'Links Needing Review':
                    warningLinks,

                'Warning Link URLs':
                    warningLinkUrls,

                'Console Errors':
                    consoleErrors,

                'Console Error Messages':
                    consoleErrorMessages,

                'Website Status':
                    websiteStatus,

                'Failure Reason':
                    failureReason,

                'Checked At':
                    new Date().toLocaleString()

            });


            // =================================================
            // FAIL PLAYWRIGHT TEST ONLY FOR MAIN SITE FAILURE
            // =================================================

            if (
                websiteStatus === 'FAIL'
            ) {

                throw new Error(
                    `Website health check failed: ${failureReason}`
                );

            }

        }
    );

}


// ============================================================
// GENERATE EXCEL REPORT AFTER ALL TESTS
// ============================================================

test.afterAll(() => {

    if (results.length > 0) {

        generateExcelReport(results);

    }

});