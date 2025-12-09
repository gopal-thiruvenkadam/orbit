import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { StrategicGoal, GoalStatus } from '../entities/StrategicGoal';
import { Objective } from '../entities/Objective';
import { KeyResult } from '../entities/KeyResult';
import { AppDataSource } from '../config/data-source';

@Resolver()
export class OKRResolver {
    private goalRepo = AppDataSource.getRepository(StrategicGoal);
    private objectiveRepo = AppDataSource.getRepository(Objective);
    private keyResultRepo = AppDataSource.getRepository(KeyResult);

    // --- Strategic Goals ---
    @Query(() => [StrategicGoal])
    async strategicGoals(): Promise<StrategicGoal[]> {
        return this.goalRepo.find({ order: { createdAt: 'DESC' } });
    }

    @Mutation(() => StrategicGoal)
    async createStrategicGoal(
        @Arg('title') title: string,
        @Arg('description', { nullable: true }) description?: string,
        @Arg('ownerId', { nullable: true }) ownerId?: string
    ): Promise<StrategicGoal> {
        const goal = this.goalRepo.create({ title, description, ownerId });
        return this.goalRepo.save(goal);
    }

    // --- Objectives ---
    @Query(() => [Objective])
    async objectives(@Arg('goalId', { nullable: true }) goalId?: string): Promise<Objective[]> {
        const where = goalId ? { strategicGoalId: goalId } : {};
        return this.objectiveRepo.find({ where, relations: ['keyResults', 'projects'], order: { createdAt: 'DESC' } });
    }

    @Mutation(() => Objective)
    async createObjective(
        @Arg('title') title: string,
        @Arg('strategicGoalId') strategicGoalId: string,
        @Arg('description', { nullable: true }) description?: string,
        @Arg('cycle', { nullable: true }) cycle?: string,
        @Arg('ownerId', { nullable: true }) ownerId?: string
    ): Promise<Objective> {
        const objective = this.objectiveRepo.create({ title, strategicGoalId, description, cycle, ownerId });
        return this.objectiveRepo.save(objective);
    }

    // --- Key Results ---
    @Mutation(() => KeyResult)
    async createKeyResult(
        @Arg('title') title: string,
        @Arg('objectiveId') objectiveId: string,
        @Arg('targetValue') targetValue: number,
        @Arg('startValue', { defaultValue: 0 }) startValue: number,
        @Arg('metricType', { defaultValue: 'number' }) metricType: string
    ): Promise<KeyResult> {
        const kr = this.keyResultRepo.create({ title, objectiveId, targetValue, startValue, metricType, currentValue: startValue });
        return this.keyResultRepo.save(kr);
    }

    @Mutation(() => KeyResult)
    async updateKeyResultProgress(
        @Arg('id') id: string,
        @Arg('currentValue') currentValue: number
    ): Promise<KeyResult> {
        const kr = await this.keyResultRepo.findOne({ where: { id } });
        if (!kr) throw new Error('KeyResult not found');
        kr.currentValue = currentValue;
        return this.keyResultRepo.save(kr);
    }
}
