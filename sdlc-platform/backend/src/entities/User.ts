import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';
import { ProjectAllocation } from './ProjectAllocation';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true, default: 'local' })
  authProvider: string; // 'local', 'okta', 'google', etc.

  @Column({ type: 'varchar', nullable: true })
  authId: string; // External Provider ID

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  department: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  position: string | null;

  @Field()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Field(() => [Project], { nullable: true })
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @Field(() => [Project], { nullable: true })
  @OneToMany(() => Project, (project) => project.lead)
  leadProjects: Project[];

  @Field(() => [ProjectAllocation], { nullable: true })
  @OneToMany(() => ProjectAllocation, (allocation) => allocation.user)
  allocations: ProjectAllocation[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for full name
  @Field()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
