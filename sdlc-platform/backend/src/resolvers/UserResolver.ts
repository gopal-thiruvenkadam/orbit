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
}
