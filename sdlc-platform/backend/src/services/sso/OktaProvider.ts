import { SSOProvider, SSOUserProfile } from './SSOProvider';
import { httpsRequest } from '../../utils/http';
import * as querystring from 'querystring';

export class OktaProvider implements SSOProvider {
    name = 'okta';

    private issuer: string;
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;

    constructor() {
        this.issuer = process.env.OKTA_ISSUER || '';
        this.clientId = process.env.OKTA_CLIENT_ID || '';
        this.clientSecret = process.env.OKTA_CLIENT_SECRET || '';
        this.redirectUri = process.env.OKTA_REDIRECT_URI || '';

        if (!this.issuer || !this.clientId || !this.clientSecret || !this.redirectUri) {
            console.warn('Okta configuration missing. SSO will not work.');
        }
    }

    getAuthUrl(state: string = 'random_state'): string {
        const params = querystring.stringify({
            client_id: this.clientId,
            response_type: 'code',
            scope: 'openid email profile',
            redirect_uri: this.redirectUri,
            state: state
        });
        return `${this.issuer}/v1/authorize?${params}`;
    }

    async handleCallback(code: string): Promise<SSOUserProfile> {
        // 1. Exchange code for tokens
        const tokenEndpoint = `${this.issuer}/v1/token`;
        const body = querystring.stringify({
            grant_type: 'authorization_code',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code,
            redirect_uri: this.redirectUri
        });

        const tokenRes = await httpsRequest('POST', tokenEndpoint, body, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        if (!tokenRes.access_token) {
            throw new Error('Failed to retrieve access token from Okta');
        }

        // 2. Get User Info
        const userInfoEndpoint = `${this.issuer}/v1/userinfo`;
        const userRes = await httpsRequest('GET', userInfoEndpoint, null, {
            'Authorization': `Bearer ${tokenRes.access_token}`
        });

        return {
            email: userRes.email,
            firstName: userRes.given_name || 'Unknown',
            lastName: userRes.family_name || 'User',
            authId: userRes.sub,
            provider: this.name
        };
    }
}
