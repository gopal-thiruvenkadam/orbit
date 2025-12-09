export interface SSOUserProfile {
    email: string;
    firstName: string;
    lastName: string;
    authId: string;
    provider: string;
}

export interface SSOProvider {
    name: string;
    getAuthUrl(state?: string): string;
    handleCallback(code: string): Promise<SSOUserProfile>;
}
