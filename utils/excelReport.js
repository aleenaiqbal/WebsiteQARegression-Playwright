const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function generateExcelReport(results) {

    // =========================================================
    // 1. REPORT FOLDER
    // =========================================================

    const reportsFolder = path.join(
        __dirname,
        '..',
        'reports'
    );

    // Create reports folder if it doesn't exist
    if (!fs.existsSync(reportsFolder)) {

        fs.mkdirSync(reportsFolder, {
            recursive: true
        });

    }


    // =========================================================
    // 2. REPORT FILE PATH
    // =========================================================

    const reportPath = path.join(
        reportsFolder,
        'Website_Health_Report.xlsx'
    );


    // =========================================================
    // 3. CREATE WORKBOOK
    // =========================================================

    const workbook = XLSX.utils.book_new();


    // =========================================================
    // 4. CREATE WORKSHEET
    // =========================================================

    const worksheet = XLSX.utils.json_to_sheet(results);


    // =========================================================
    // 5. ADD WORKSHEET TO WORKBOOK
    // =========================================================

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Website Health'
    );


    // =========================================================
    // 6. SET COLUMN WIDTHS
    // =========================================================

    worksheet['!cols'] = [

        // Site Name
        {
            wch: 25
        },

        // URL
        {
            wch: 55
        },

        // HTTP Status
        {
            wch: 15
        },

        // Page Load Time
        {
            wch: 22
        },

        // Page Title
        {
            wch: 45
        },

        // Total Links
        {
            wch: 15
        },

        // Broken Links
        {
            wch: 15
        },

        // Broken Link URLs
        {
            wch: 60
        },

        // Console Errors
        {
            wch: 18
        },

        // Console Error Messages
        {
            wch: 70
        },

        // Website Status
        {
            wch: 18
        },

        // Failure Reason
        {
            wch: 60
        },

        // Checked At
        {
            wch: 25
        }

    ];


    // =========================================================
    // 7. FREEZE HEADER ROW
    // =========================================================

    worksheet['!freeze'] = {
        xSplit: 0,
        ySplit: 1
    };


    // =========================================================
    // 8. ADD AUTO FILTER
    // =========================================================

    if (results.length > 0) {

        const columnCount =
            Object.keys(results[0]).length;

        const lastColumn =
            XLSX.utils.encode_col(columnCount - 1);

        const lastRow =
            results.length + 1;

        worksheet['!autofilter'] = {
            ref: `A1:${lastColumn}${lastRow}`
        };

    }


    // =========================================================
    // 9. WRITE EXCEL FILE
    // =========================================================

    XLSX.writeFile(
        workbook,
        reportPath
    );


    // =========================================================
    // 10. CONSOLE MESSAGE
    // =========================================================

    console.log('\n========================================');

    console.log(
        '📊 Excel report generated successfully!'
    );

    console.log(
        `📁 Report: ${reportPath}`
    );

    console.log('========================================\n');


    // =========================================================
    // 11. RETURN REPORT PATH
    // =========================================================

    return reportPath;

}


// =============================================================
// EXPORT FUNCTION
// =============================================================

module.exports = {
    generateExcelReport
};