import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Project, ProjectStatus } from '../entities/Project';
import { AppDataSource } from '../config/data-source';

@Resolver()
export class ProjectResolver {
    private projectRepository = AppDataSource.getRepository(Project);

    @Query(() => [Project])
    async projects(): Promise<Project[]> {
        return this.projectRepository.find({ relations: ['owner', 'lead'] });
    }

    @Query(() => Project, { nullable: true })
    async project(@Arg('id') id: string): Promise<Project | null> {
        // Validate UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return null; // Return null for invalid UUIDs (e.g. "new")
        }
        return this.projectRepository.findOne({ where: { id }, relations: ['owner', 'lead'] }) || null;
    }

    @Mutation(() => Project)
    async createProject(
        @Arg('name') name: string,
        @Arg('description') description: string,
        @Arg('ownerId') ownerId: string,
        @Arg('objectiveId', { nullable: true }) objectiveId?: string
    ): Promise<Project> {
        const project = this.projectRepository.create({
            name,
            description,
            status: ProjectStatus.PLANNING,
            ownerId,
            objectiveId: objectiveId || undefined
        });
        return this.projectRepository.save(project);
    }
    @Mutation(() => Project)
    async updateProject(
        @Arg('id') id: string,
        @Arg('name', { nullable: true }) name?: string,
        @Arg('description', { nullable: true }) description?: string,
        @Arg('status', () => ProjectStatus, { nullable: true }) status?: ProjectStatus,
        @Arg('progress', () => Number, { nullable: true }) progress?: number,
        @Arg('startDate', { nullable: true }) startDate?: Date,
        @Arg('targetEndDate', { nullable: true }) targetEndDate?: Date,
        @Arg('ownerId', { nullable: true }) ownerId?: string,
        @Arg('leadId', { nullable: true }) leadId?: string,
        @Arg('objectiveId', { nullable: true }) objectiveId?: string
    ): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id } });
        if (!project) throw new Error('Project not found');

        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (status !== undefined) project.status = status;
        if (progress !== undefined) project.progress = progress;
        if (startDate !== undefined) project.startDate = startDate;
        if (targetEndDate !== undefined) project.targetEndDate = targetEndDate;
        if (ownerId !== undefined) project.ownerId = ownerId;
        if (leadId !== undefined) project.leadId = leadId;
        if (objectiveId !== undefined) project.objectiveId = objectiveId || null;

        return this.projectRepository.save(project);
    }

    @Mutation(() => Boolean)
    async deleteProject(@Arg('id') id: string): Promise<boolean> {
        const result = await this.projectRepository.delete(id);
        return result.affected !== 0;
    }
}
