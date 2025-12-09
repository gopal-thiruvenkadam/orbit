import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from 'type-graphql';
import { StrategicGoal } from './StrategicGoal';
import { User } from './User';
import { KeyResult } from './KeyResult';
import { Project } from './Project';

@ObjectType()
@Entity('objectives')
export class Objective {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    title: string;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    cycle: string; // e.g., "Q1 2025", "Annual 2025"

    @Field(() => ID)
    @Column({ type: 'uuid' })
    strategicGoalId: string;

    @Field(() => StrategicGoal)
    @ManyToOne(() => StrategicGoal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'strategicGoalId' })
    strategicGoal: StrategicGoal;

    @Field(() => ID, { nullable: true })
    @Column({ type: 'uuid', nullable: true })
    ownerId: string;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Field(() => [KeyResult], { nullable: true })
    @OneToMany(() => KeyResult, kr => kr.objective)
    keyResults: KeyResult[];

    @Field(() => [Project], { nullable: true })
    @OneToMany(() => Project, project => project.objective)
    projects: Project[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => Float)
    get progress(): number {
        if (!this.keyResults || this.keyResults.length === 0) return 0;
        const totalProgress = this.keyResults.reduce((acc, kr) => acc + kr.progress, 0);
        return Math.round(totalProgress / this.keyResults.length);
    }
}
