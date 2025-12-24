import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';

@Resolver()
export class UserResolver {
    private userRepository = AppDataSource.getRepository(User);

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['allocations', 'allocations.project']
        });
    }

    @Query(() => User, { nullable: true })
    async user(@Arg('id') id: string): Promise<User | null> { // Changed undefined to null
        return this.userRepository.findOne({ where: { id } }) || null; // Ensure null is returned
    }

    @Mutation(() => User)
    async createUser(
        @Arg('email') email: string,
        @Arg('firstName') firstName: string,
        @Arg('lastName') lastName: string
    ): Promise<User> {
        const user = this.userRepository.create({
            email,
            firstName,
            lastName,
            password: 'hashed_password_placeholder', // In real app, hash this
            isActive: true,
        });
        return this.userRepository.save(user);
    }

    @Mutation(() => User)
    async updateUser(
        @Arg('id') id: string,
        @Arg('firstName', { nullable: true }) firstName?: string,
        @Arg('lastName', { nullable: true }) lastName?: string,
        @Arg('email', { nullable: true }) email?: string,
        @Arg('department', { nullable: true }) department?: string,
        @Arg('position', { nullable: true }) position?: string,
        @Arg('isActive', { nullable: true }) isActive?: boolean
    ): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new Error('User not found');

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (email !== undefined) user.email = email;
        if (department !== undefined) user.department = department || null;
        if (position !== undefined) user.position = position || null;
        if (isActive !== undefined) user.isActive = isActive;

        return this.userRepository.save(user);
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: string): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected === 1;
    }

    @Mutation(() => [User])
    async importUsersFromCSV(@Arg('csvContent') csvContent: string): Promise<User[]> {
        // Simple CSV parser
        const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const users: User[] = [];
        const processedEmails = new Set<string>();

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length !== headers.length) continue;

            const userData: any = {};
            headers.forEach((header, index) => {
                // Map common CSV headers to User fields
                if (header === 'firstname' || header === 'first name') userData.firstName = values[index];
                else if (header === 'lastname' || header === 'last name') userData.lastName = values[index];
                else if (header === 'email') userData.email = values[index];
                else if (header === 'department') userData.department = values[index];
                else if (header === 'position' || header === 'role') userData.position = values[index];
            });

            if (userData.email && userData.firstName && userData.lastName) {
                // Normalize email to lowercase
                const normalizedEmail = userData.email.toLowerCase();

                // Skip if this email was already processed in this batch
                if (processedEmails.has(normalizedEmail)) continue;

                // Check if user exists in DB (Case Insensitive)
                // Using QueryBuilder to ensure case-insensitive check across different DBs if needed, 
                // but standard ILike is good for Postgres. 
                // Alternatively, just checking lowercase transform which is safer if ILike isn't imported.
                const existingUser = await this.userRepository.createQueryBuilder("user")
                    .where("LOWER(user.email) = :email", { email: normalizedEmail })
                    .getOne();

                if (!existingUser) {
                    const newUser = this.userRepository.create({
                        ...userData,
                        email: normalizedEmail, // Save as normalized lowercase
                        password: 'default_password', // Set a default or random password
                        isActive: true
                    });
                    const savedUser = await this.userRepository.save(newUser);
                    // Force cast or handle potential array return
                    users.push(Array.isArray(savedUser) ? savedUser[0] : savedUser as User);
                    processedEmails.add(normalizedEmail);
                }
            }
        }
        return users;
    }
}
