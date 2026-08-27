const XLSX = require('xlsx');
const path = require('path');

function readWebsites() {

    const filePath = path.join(
        __dirname,
        '..',
        'data',
        'websites.xlsx'
    );

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const websites = XLSX.utils.sheet_to_json(worksheet);

    return websites;
}

module.exports = {
    readWebsites
};