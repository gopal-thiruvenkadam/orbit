import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from 'type-graphql';
import { Objective } from './Objective';

@ObjectType()
@Entity('key_results')
export class KeyResult {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    title: string;

    @Field(() => Float)
    @Column({ type: 'float', default: 0 })
    startValue: number;

    @Field(() => Float)
    @Column({ type: 'float' })
    targetValue: number;

    @Field(() => Float)
    @Column({ type: 'float', default: 0 })
    currentValue: number;

    @Field()
    @Column({ default: 'number' }) // number, percentage, currency
    metricType: string;

    @Field(() => ID)
    @Column({ type: 'uuid' })
    objectiveId: string;

    @Field(() => Objective)
    @ManyToOne(() => Objective, objective => objective.keyResults, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'objectiveId' })
    objective: Objective;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => Float)
    get progress(): number {
        if (this.targetValue === this.startValue) return 0;
        const progress = ((this.currentValue - this.startValue) / (this.targetValue - this.startValue)) * 100;
        return Math.max(progress, 0);
    }
}
