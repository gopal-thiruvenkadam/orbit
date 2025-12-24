import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { User } from './User';
import { Project } from './Project';

@ObjectType()
@Entity('project_allocations')
export class ProjectAllocation {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => ID)
    @Column({ type: 'uuid' })
    userId: string;

    @Field(() => ID)
    @Column({ type: 'uuid' })
    projectId: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.allocations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Field(() => Project)
    @ManyToOne(() => Project, (project) => project.allocations)
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Field(() => Int)
    @Column({ type: 'int', default: 0 })
    allocationPercentage: number; // e.g., 50 for 50%

    @Field(() => String, { nullable: true })
    @Column({ type: 'varchar', nullable: true })
    role: string | null;

    @Field(() => String)
    @Column({ type: 'date' })
    startDate: Date;

    @Field(() => String)
    @Column({ type: 'date' })
    endDate: Date;

    @Field()
    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
