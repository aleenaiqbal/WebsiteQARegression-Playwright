async function checkLinks(request, links) {

    const results = [];

    for (const link of links) {

        // =====================================================
        // GET URL
        // =====================================================

        let url;

        if (typeof link === 'string') {

            url = link;

        } else if (link && link.url) {

            url = link.url;

        } else {

            continue;

        }


        // =====================================================
        // CHECK LINK
        // =====================================================

        try {

            const response = await request.get(url, {

                timeout: 15000,

                failOnStatusCode: false

            });


            const status = response.status();


            let result = 'PASS';

            let category = 'Working';


            // =================================================
            // 200 - 399
            // =================================================

            if (
                status >= 200 &&
                status < 400
            ) {

                result = 'PASS';

                category = 'Working';

            }


            // =================================================
            // 400 - 499
            // =================================================

            else if (
                status >= 400 &&
                status < 500
            ) {

                result = 'WARNING';

                category = 'HTTP Client Error';

            }


            // =================================================
            // 500 - 599
            // =================================================

            else if (
                status >= 500 &&
                status < 600
            ) {

                result = 'FAIL';

                category = 'Server Error';

            }


            // =================================================
            // UNKNOWN STATUS
            // =================================================

            else {

                result = 'WARNING';

                category = 'Unknown HTTP Status';

            }


            // =================================================
            // SAVE RESULT
            // =================================================

            results.push({

                url: url,

                status: status,

                result: result,

                category: category,

                error: ''

            });

        }


        // =====================================================
        // REQUEST ERROR
        // =====================================================

        catch (error) {

            results.push({

                url: url,

                status: 'ERROR',

                result: 'WARNING',

                category: 'Request Failed',

                error: error.message

            });

        }

    }


    return results;

}


// =============================================================
// EXPORT
// =============================================================

module.exports = {

    checkLinks

};