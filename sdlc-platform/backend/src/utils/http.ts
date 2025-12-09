import https from 'https';
import { URL } from 'url';

export async function httpsRequest(
    method: 'GET' | 'POST',
    url: string,
    body?: any,
    headers: Record<string, string> = {}
): Promise<any> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options: https.RequestOptions = {
            method,
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded', // Default for OIDC often
                'Accept': 'application/json'
            }
        };

        if (method === 'POST' && body) {
            // If body is URLSearchParams string, use it directly, else JSON
            if (typeof body === 'string') {
                options.headers!['Content-Length'] = Buffer.byteLength(body);
            } else {
                options.headers!['Content-Type'] = 'application/json';
                body = JSON.stringify(body);
                options.headers!['Content-Length'] = Buffer.byteLength(body);
            }
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        // Fallback if response is text
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(body);
        }
        req.end();
    });
}
