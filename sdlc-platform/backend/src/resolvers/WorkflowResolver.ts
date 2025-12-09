import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { WorkflowPhase } from '../entities/WorkflowPhase';
import { WorkflowTask, TaskStatus, TaskPriority } from '../entities/WorkflowTask';
import { AppDataSource } from '../config/data-source';

@Resolver()
export class WorkflowResolver {
    private phaseRepository = AppDataSource.getRepository(WorkflowPhase);
    private taskRepository = AppDataSource.getRepository(WorkflowTask);

    @Query(() => [WorkflowPhase])
    async getProjectWorkflow(@Arg('projectId', () => ID) projectId: string): Promise<WorkflowPhase[]> {
        return this.phaseRepository.find({
            where: { projectId },
            relations: ['tasks', 'tasks.assignedTo'],
            order: {
                createdAt: 'ASC', // Assuming phases are created in order, or we might need an order field
            },
        });
    }

    @Query(() => [WorkflowTask])
    async getPhaseTasks(@Arg('phaseId', () => ID) phaseId: string): Promise<WorkflowTask[]> {
        return this.taskRepository.find({
            where: { phaseId },
            relations: ['assignedTo'],
            order: {
                createdAt: 'ASC',
            },
        });
    }

    @Query(() => [WorkflowTask])
    async getRecentTasks(@Arg('limit', () => Number, { defaultValue: 5 }) limit: number): Promise<WorkflowTask[]> {
        return this.taskRepository.find({
            relations: ['assignedTo', 'project'],
            order: {
                updatedAt: 'DESC',
            },
            take: limit,
        });
    }

    @Query(() => String) // Returning JSON string for simplicity for now, or define an ObjectType
    async getWorkflowMetrics(): Promise<string> {
        // Aggregate progress by phase type across all projects
        // This is a simplified implementation. In a real app, you'd want more complex aggregation.
        const phases = await this.phaseRepository.find();
        const metrics: Record<string, { total: number, count: number }> = {};

        phases.forEach(phase => {
            if (!metrics[phase.phaseType]) {
                metrics[phase.phaseType] = { total: 0, count: 0 };
            }
            // Assuming we can calculate progress for a phase. 
            // For now, let's assume completed = 100, in_progress = 50, not_started = 0
            let progress = 0;
            if (phase.status === 'completed') progress = 100;
            else if (phase.status === 'in_progress') progress = 50;

            metrics[phase.phaseType].total += progress;
            metrics[phase.phaseType].count += 1;
        });

        const result: Record<string, number> = {};
        for (const type in metrics) {
            result[type] = Math.round(metrics[type].total / metrics[type].count);
        }

        return JSON.stringify(result);
    }

    @Mutation(() => WorkflowPhase)
    async createPhase(
        @Arg('projectId', () => ID) projectId: string,
        @Arg('phaseType', () => String) phaseType: string, // Using String to accept PhaseType enum values
        @Arg('status', () => String, { defaultValue: 'not_started' }) status: string,
        @Arg('startDate', { nullable: true }) startDate?: Date,
        @Arg('endDate', { nullable: true }) endDate?: Date,
        @Arg('notes', { nullable: true }) notes?: string
    ): Promise<WorkflowPhase> {
        const phase = this.phaseRepository.create({
            projectId,
            phaseType: phaseType as any,
            status: status as any,
            startDate,
            endDate,
            notes
        });
        return this.phaseRepository.save(phase);
    }

    @Mutation(() => WorkflowPhase)
    async updatePhase(
        @Arg('id', () => ID) id: string,
        @Arg('status', () => String, { nullable: true }) status?: string,
        @Arg('startDate', { nullable: true }) startDate?: Date,
        @Arg('endDate', { nullable: true }) endDate?: Date,
        @Arg('notes', { nullable: true }) notes?: string
    ): Promise<WorkflowPhase> {
        const phase = await this.phaseRepository.findOne({ where: { id } });
        if (!phase) throw new Error('Phase not found');

        if (status !== undefined) phase.status = status as any;
        if (startDate !== undefined) phase.startDate = startDate;
        if (endDate !== undefined) phase.endDate = endDate;
        if (notes !== undefined) phase.notes = notes;

        return this.phaseRepository.save(phase);
    }

    @Mutation(() => Boolean)
    async deletePhase(@Arg('id', () => ID) id: string): Promise<boolean> {
        const result = await this.phaseRepository.delete(id);
        return result.affected !== 0;
    }

    @Mutation(() => WorkflowTask)
    async createTask(
        @Arg('projectId', () => ID) projectId: string,
        @Arg('phaseId', () => ID) phaseId: string,
        @Arg('title') title: string,
        @Arg('taskType', () => String) taskType: string,
        @Arg('status', () => TaskStatus, { defaultValue: TaskStatus.TODO }) status: TaskStatus,
        @Arg('priority', () => TaskPriority, { defaultValue: TaskPriority.MEDIUM }) priority: TaskPriority,
        @Arg('description', { nullable: true }) description?: string,
        @Arg('assignedToId', () => ID, { nullable: true }) assignedToId?: string,
        @Arg('dueDate', { nullable: true }) dueDate?: Date
    ): Promise<WorkflowTask> {
        const task = this.taskRepository.create({
            projectId,
            phaseId,
            title,
            taskType: taskType as any,
            status,
            priority,
            description,
            assignedToId,
            dueDate
        });
        return this.taskRepository.save(task);
    }

    @Mutation(() => WorkflowTask)
    async updateTask(
        @Arg('id', () => ID) id: string,
        @Arg('title', { nullable: true }) title?: string,
        @Arg('description', { nullable: true }) description?: string,
        @Arg('status', () => TaskStatus, { nullable: true }) status?: TaskStatus,
        @Arg('priority', () => TaskPriority, { nullable: true }) priority?: TaskPriority,
        @Arg('assignedToId', () => ID, { nullable: true }) assignedToId?: string,
        @Arg('dueDate', { nullable: true }) dueDate?: Date
    ): Promise<WorkflowTask> {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) throw new Error('Task not found');

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (assignedToId !== undefined) task.assignedToId = assignedToId;
        if (dueDate !== undefined) task.dueDate = dueDate;

        return this.taskRepository.save(task);
    }

    @Mutation(() => Boolean)
    async deleteTask(@Arg('id', () => ID) id: string): Promise<boolean> {
        const result = await this.taskRepository.delete(id);
        return result.affected !== 0;
    }
}
