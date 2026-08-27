async function checkLinks(request, links) {

    const results = [];

    for (const link of links) {

        // Skip empty links
        if (!link.href) {
            continue;
        }

        // Skip non-web links
        if (
            link.href.startsWith('mailto:') ||
            link.href.startsWith('tel:') ||
            link.href.startsWith('javascript:') ||
            link.href.startsWith('#')
        ) {
            continue;
        }

        try {

            const response = await request.get(link.href, {
                timeout: 15000
            });

            const status = response.status();

            results.push({
                text: link.text || 'N/A',
                url: link.href,
                status: status,
                result: status >= 200 && status < 400
                    ? 'PASS'
                    : 'FAIL'
            });

        } catch (error) {

            results.push({
                text: link.text || 'N/A',
                url: link.href,
                status: 'ERROR',
                result: 'FAIL'
            });
        }
    }

    return results;
}

module.exports = {
    checkLinks
};