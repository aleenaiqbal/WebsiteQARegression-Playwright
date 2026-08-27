const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');


// ============================================================
// GENERATE EXCEL REPORT
// ============================================================

function generateExcelReport(results) {


    // ========================================================
    // REPORT FOLDER
    // ========================================================

    const reportsFolder =
        path.join(
            __dirname,
            '..',
            'reports'
        );


    if (
        !fs.existsSync(reportsFolder)
    ) {

        fs.mkdirSync(
            reportsFolder,
            {
                recursive: true
            }
        );

    }


    // ========================================================
    // REPORT PATH
    // ========================================================

    const reportPath =
        path.join(
            reportsFolder,
            'Website_Health_Report.xlsx'
        );


    // ========================================================
    // CREATE WORKBOOK
    // ========================================================

    const workbook =
        XLSX.utils.book_new();


    // ========================================================
    // CREATE WORKSHEET
    // ========================================================

    const worksheet =
        XLSX.utils.json_to_sheet(
            results
        );


    // ========================================================
    // ADD WORKSHEET
    // ========================================================

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Website Health'
    );


    // ========================================================
    // COLUMN WIDTHS
    // ========================================================

    worksheet['!cols'] = [

        { wch: 25 }, // Site Name

        { wch: 55 }, // URL

        { wch: 15 }, // HTTP Status

        { wch: 22 }, // Page Load Time

        { wch: 50 }, // Page Title

        { wch: 15 }, // Total Links

        { wch: 15 }, // Broken Links

        { wch: 60 }, // Broken Link URLs

        { wch: 25 }, // Links Needing Review

        { wch: 70 }, // Warning Link URLs

        { wch: 18 }, // Console Errors

        { wch: 70 }, // Console Error Messages

        { wch: 25 }, // Failed Network Requests

        { wch: 100 }, // Failed Network Request Details

        { wch: 18 }, // Website Status

        { wch: 60 }, // Failure Reason

        { wch: 25 }  // Checked At

    ];


    // ========================================================
    // FREEZE HEADER
    // ========================================================

    worksheet['!freeze'] = {

        xSplit: 0,

        ySplit: 1

    };


    // ========================================================
    // AUTO FILTER
    // ========================================================

    if (
        results.length > 0
    ) {

        const columnCount =
            Object.keys(
                results[0]
            ).length;


        const lastColumn =
            XLSX.utils.encode_col(
                columnCount - 1
            );


        const lastRow =
            results.length + 1;


        worksheet['!autofilter'] = {

            ref:
                `A1:${lastColumn}${lastRow}`

        };

    }


    // ========================================================
    // WRITE FILE
    // ========================================================

    XLSX.writeFile(
        workbook,
        reportPath
    );


    // ========================================================
    // CONSOLE MESSAGE
    // ========================================================

    console.log(
        '\n========================================'
    );


    console.log(
        '📊 Excel report generated successfully!'
    );


    console.log(
        `📁 Report: ${reportPath}`
    );


    console.log(
        '========================================\n'
    );


    return reportPath;

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    generateExcelReport

};