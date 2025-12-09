import { OktaProvider } from './sso/OktaProvider';
import { SSOProvider } from './sso/SSOProvider';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';
import jwt from 'jsonwebtoken';

export class AuthService {
    private providers: Record<string, SSOProvider> = {};
    private userRepository = AppDataSource.getRepository(User);

    constructor() {
        // Register default providers
        const okta = new OktaProvider();
        this.registerProvider(okta);
    }

    registerProvider(provider: SSOProvider) {
        this.providers[provider.name] = provider;
    }

    getProvider(name: string): SSOProvider {
        const provider = this.providers[name];
        if (!provider) throw new Error(`Provider ${name} not found`);
        return provider;
    }

    async handleSSOCallback(providerName: string, code: string): Promise<{ user: User, token: string }> {
        const provider = this.getProvider(providerName);
        const profile = await provider.handleCallback(code);

        // Find or Create User
        // Priority: Check by authId first (stable), then email (linking)
        let user: User | null = null;

        // 1. Try by Auth ID
        user = await this.userRepository.findOne({ where: { authId: profile.authId, authProvider: providerName } });

        // 2. Try by Email if not found
        if (!user) {
            user = await this.userRepository.findOne({ where: { email: profile.email } });

            if (user) {
                // Link account
                user.authId = profile.authId;
                user.authProvider = profile.provider;
            } else {
                // Create new
                user = this.userRepository.create({
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    authProvider: profile.provider,
                    authId: profile.authId,
                    isActive: true,
                    password: '' // No password for SSO
                });
            }
        } else {
            // Update info
            user.firstName = profile.firstName;
            user.lastName = profile.lastName;
        }

        if (!user) {
            throw new Error('Failed to create or update user');
        }

        const savedUser = await this.userRepository.save(user);

        // Generate JWT
        const token = jwt.sign(
            { userId: savedUser.id, email: savedUser.email, role: savedUser.isAdmin ? 'ADMIN' : 'USER' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        return { user: savedUser, token };
    }
}
