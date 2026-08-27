// ============================================================
// NETWORK REQUEST CHECKER
// ============================================================

function setupNetworkChecker(page) {

    const failedRequests = [];


    // ========================================================
    // REQUEST FAILED
    // ========================================================

    page.on('requestfailed', request => {

        failedRequests.push({

            url: request.url(),

            method: request.method(),

            resourceType: request.resourceType(),

            status: 'FAILED',

            failure:
                request.failure()?.errorText ||
                'Unknown request failure'

        });

    });


    // ========================================================
    // HTTP RESPONSE ERRORS
    // ========================================================

    page.on('response', response => {

        const status = response.status();


        // Only capture HTTP errors

        if (status >= 400) {

            failedRequests.push({

                url: response.url(),

                method:
                    response.request().method(),

                resourceType:
                    response.request().resourceType(),

                status: status,

                failure:
                    `HTTP ${status}`

            });

        }

    });


    // ========================================================
    // RETURN CHECKER
    // ========================================================

    return {

        getFailedRequests() {

            return failedRequests;

        }

    };

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    setupNetworkChecker

};