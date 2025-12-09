import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { ProjectAllocation } from '../entities/ProjectAllocation';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Project } from '../entities/Project';

@Resolver(() => ProjectAllocation)
export class AllocationResolver {
    private allocationRepository = AppDataSource.getRepository(ProjectAllocation);
    private userRepository = AppDataSource.getRepository(User);
    private projectRepository = AppDataSource.getRepository(Project);

    @Query(() => [ProjectAllocation])
    async getAllAllocations(): Promise<ProjectAllocation[]> {
        return this.allocationRepository.find({
            relations: ['user', 'project']
        });
    }

    @Mutation(() => ProjectAllocation)
    async createAllocation(
        @Arg('userId', () => ID) userId: string,
        @Arg('projectId', () => ID) projectId: string,
        @Arg('allocationPercentage') allocationPercentage: number,
        @Arg('startDate') startDate: Date,
        @Arg('endDate') endDate: Date,
        @Arg('role', { nullable: true }) role?: string
    ): Promise<ProjectAllocation> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) throw new Error('Project not found');

        const allocation = this.allocationRepository.create({
            user,
            project,
            allocationPercentage,
            startDate,
            endDate,
            role
        });

        return this.allocationRepository.save(allocation);
    }

    @Mutation(() => ProjectAllocation)
    async updateAllocation(
        @Arg('id', () => ID) id: string,
        @Arg('allocationPercentage', { nullable: true }) allocationPercentage?: number,
        @Arg('startDate', { nullable: true }) startDate?: Date,
        @Arg('endDate', { nullable: true }) endDate?: Date,
        @Arg('role', { nullable: true }) role?: string,
        @Arg('isActive', { nullable: true }) isActive?: boolean
    ): Promise<ProjectAllocation> {
        const allocation = await this.allocationRepository.findOne({ where: { id } });
        if (!allocation) throw new Error('Allocation not found');

        if (allocationPercentage !== undefined) allocation.allocationPercentage = allocationPercentage;
        if (startDate !== undefined) allocation.startDate = startDate;
        if (endDate !== undefined) allocation.endDate = endDate;
        if (role !== undefined) allocation.role = role || null;
        if (isActive !== undefined) allocation.isActive = isActive;

        return this.allocationRepository.save(allocation);
    }

    @Mutation(() => Boolean)
    async deleteAllocation(@Arg('id', () => ID) id: string): Promise<boolean> {
        const result = await this.allocationRepository.delete(id);
        return result.affected === 1;
    }
}
