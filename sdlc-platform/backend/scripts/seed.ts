import { User } from '../src/entities/User';
import { Project, ProjectStatus } from '../src/entities/Project';
import { WorkflowPhase, PhaseType, PhaseStatus } from '../src/entities/WorkflowPhase';
import { WorkflowTask, PhaseTask, TaskStatus, TaskPriority } from '../src/entities/WorkflowTask';
import { ProjectAllocation } from '../src/entities/ProjectAllocation';
import { AppDataSource } from '../src/config/data-source';
import { logger } from '../src/utils/logger';

async function seed() {
    try {
        await AppDataSource.initialize();
        logger.info('Database connection established for seeding');

        const userRepository = AppDataSource.getRepository(User);
        const projectRepository = AppDataSource.getRepository(Project);

        // Create Users
        const users = [
            {
                email: 'jane.smith@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
                password: 'password123',
                position: 'Product Manager',
                department: 'Product',
            },
            {
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'password123',
                position: 'Lead Developer',
                department: 'Engineering',
            },
            {
                email: 'alex.johnson@example.com',
                firstName: 'Alex',
                lastName: 'Johnson',
                password: 'password123',
                position: 'DevOps Engineer',
                department: 'Operations',
            },
        ];

        const savedUsers = [];
        for (const userData of users) {
            let user = await userRepository.findOne({ where: { email: userData.email } });
            if (!user) {
                user = userRepository.create(userData);
                await userRepository.save(user);
                logger.info(`Created user: ${user.email}`);
            } else {
                logger.info(`User already exists: ${user.email}`);
            }
            savedUsers.push(user);
        }

        // Create Projects
        const projects = [
            {
                name: 'SDLC Platform Development',
                description: 'Development of the SDLC Management Platform',
                status: ProjectStatus.IN_PROGRESS,
                owner: savedUsers[0],
                lead: savedUsers[1],
                progress: 45,
                currentPhase: 'Development',
            },
            {
                name: 'API Integration Service',
                description: 'Service for integrating with external APIs',
                status: ProjectStatus.PLANNING,
                owner: savedUsers[1],
                lead: savedUsers[2],
                progress: 15,
                currentPhase: 'Planning',
            },
            {
                name: 'Authentication Module',
                description: 'User authentication and authorization module',
                status: ProjectStatus.IN_PROGRESS,
                owner: savedUsers[2],
                lead: savedUsers[0],
                progress: 75,
                currentPhase: 'Testing',
            },
        ];

        for (const projectData of projects) {
            let project = await projectRepository.findOne({ where: { name: projectData.name } });
            if (!project) {
                project = projectRepository.create({
                    name: projectData.name,
                    description: projectData.description,
                    status: projectData.status,
                    owner: projectData.owner,
                    lead: projectData.lead,
                    progress: projectData.progress,
                    currentPhase: projectData.currentPhase,
                });
                await projectRepository.save(project);
                logger.info(`Created project: ${project.name}`);
            } else {
                logger.info(`Project already exists: ${project.name}`);
            }
        }

        // Create Workflow Phases and Tasks for the first project
        const workflowPhaseRepository = AppDataSource.getRepository(WorkflowPhase);
        const workflowTaskRepository = AppDataSource.getRepository(WorkflowTask);

        const project = await projectRepository.findOne({ where: { name: projects[0].name } });

        if (project) {
            const phases = [
                {
                    phaseType: PhaseType.PLANNING,
                    status: PhaseStatus.COMPLETED,
                    projectId: project.id,
                    startDate: new Date('2023-01-01'),
                    endDate: new Date('2023-01-15'),
                    tasks: [
                        { title: 'Project Definition', taskType: PhaseTask.PROJECT_DEFINITION, status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH },
                        { title: 'Threat Modeling', taskType: PhaseTask.THREAT_MODELING, status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH },
                        { title: 'DFT Creation', taskType: PhaseTask.DFT_CREATION, status: TaskStatus.COMPLETED, priority: TaskPriority.MEDIUM },
                        { title: 'Project Risk Assessment', taskType: PhaseTask.PROJECT_RISK_ISSUES_ASSESSMENT, status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH },
                        { title: 'Regulatory Assessment', taskType: PhaseTask.REGULATORY_ASSESSMENT, status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH },
                        { title: 'Requirements Engineering', taskType: PhaseTask.REQUIREMENTS_ENGINEERING, status: TaskStatus.COMPLETED, priority: TaskPriority.CRITICAL },
                        { title: 'Resource & Budget Planning', taskType: PhaseTask.RESOURCE_BUDGET_PLANNING, status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH },
                        { title: 'Traceability Matrix Creation', taskType: PhaseTask.TRACEABILITY_MATRIX_CREATION, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Clinical Workflow Analysis', taskType: PhaseTask.CRITICAL_WORKFLOW_ANALYSIS, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH },
                        { title: 'Product Function Development', taskType: PhaseTask.PRODUCT_FUNCTION_DEVELOPMENT, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Jira/API Quality Integration', taskType: PhaseTask.JIRA_API_QUALITY_INTEGRATION, status: TaskStatus.TODO, priority: TaskPriority.LOW }
                    ]
                },
                {
                    phaseType: PhaseType.ARCHITECTURE,
                    status: PhaseStatus.IN_PROGRESS,
                    projectId: project.id,
                    startDate: new Date('2023-01-16'),
                    endDate: new Date('2023-02-15'),
                    tasks: [
                        { title: 'Formal Architecture Development', taskType: PhaseTask.FORMAL_ARCHITECTURE_DEVELOPMENT, status: TaskStatus.COMPLETED, priority: TaskPriority.CRITICAL },
                        { title: 'Modular Design with Feature Flags', taskType: PhaseTask.MODULE_DESIGN_WITH_FEATURE_SIGN_OFF, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH },
                        { title: 'Interface Design', taskType: PhaseTask.INTERFACE_DESIGN, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH },
                        { title: 'UX Design', taskType: PhaseTask.UI_DESIGN, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Data & Data Privacy', taskType: PhaseTask.DATA_UX_DATA_PRIVACY_DESIGN, status: TaskStatus.TODO, priority: TaskPriority.CRITICAL },
                        { title: 'Security Design & Threat Modeling', taskType: PhaseTask.SECURITY_DESIGN_THREAT_MODELING, status: TaskStatus.TODO, priority: TaskPriority.CRITICAL },
                        { title: 'Observability Design', taskType: PhaseTask.OBSERVABILITY_DESIGN, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'FMEA Analysis and Design', taskType: PhaseTask.FMEA_ANALYSIS_DESIGN, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Test Design', taskType: PhaseTask.TEST_DESIGN, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Operations & Analytics Design', taskType: PhaseTask.OPERATIONS_ANALYTICS_DESIGN, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Project GMP', taskType: PhaseTask.PROJECT_GMP, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Comprehensive Test Planning Ready', taskType: PhaseTask.COMPREHENSIVE_TEST_PLANNING_READY, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Initial FMEA Reports', taskType: PhaseTask.INITIAL_FMEA_REPORTS, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM }
                    ]
                },
                {
                    phaseType: PhaseType.IMPLEMENTATION,
                    status: PhaseStatus.NOT_STARTED,
                    projectId: project.id,
                    startDate: new Date('2023-02-16'),
                    endDate: new Date('2023-04-15'),
                    tasks: [
                        { title: 'Environment Set-up', taskType: PhaseTask.ENVIRONMENT_SET_UP, status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH },
                        { title: 'Code Implementation', taskType: PhaseTask.CODE_IMPLEMENTATION, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.CRITICAL },
                        { title: 'CI/CD Pipelines', taskType: PhaseTask.CI_CD_PIPELINES, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH },
                        { title: 'Automated Unit and Integration', taskType: PhaseTask.AUTOMATED_UNIT_INTEGRATION_WITH_DAY_COMPONENTS, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Build Merge Analysis on Code Integration', taskType: PhaseTask.BUILD_MERGE_ANALYSIS_CODE_INTEGRATION, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Observability and Operational Environment', taskType: PhaseTask.OBSERVABILITY_OPERATIONAL_ENV_IMPLEMENTATION, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM }
                    ]
                },
                {
                    phaseType: PhaseType.TESTING,
                    status: PhaseStatus.NOT_STARTED,
                    projectId: project.id,
                    startDate: new Date('2023-04-16'),
                    endDate: new Date('2023-05-15'),
                    tasks: [
                        { title: 'Unit Directive Testing', taskType: PhaseTask.UNIT_DIRECTIVE_TESTING, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH },
                        { title: 'System E2E Testing', taskType: PhaseTask.SYSTEM_E2E_TESTING, status: TaskStatus.TODO, priority: TaskPriority.CRITICAL },
                        { title: 'Clinical Workflow Testing', taskType: PhaseTask.CRITICAL_WORKFLOW_TESTING, status: TaskStatus.TODO, priority: TaskPriority.CRITICAL },
                        { title: 'Regulatory Validation', taskType: PhaseTask.REGULATORY_VALIDATION, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Security Testing', taskType: PhaseTask.SECURITY_TESTING, status: TaskStatus.TODO, priority: TaskPriority.CRITICAL },
                        { title: 'Data Validation', taskType: PhaseTask.DATA_VALIDATION, status: TaskStatus.TODO, priority: TaskPriority.HIGH }
                    ]
                },
                {
                    phaseType: PhaseType.DEPLOYMENT,
                    status: PhaseStatus.NOT_STARTED,
                    projectId: project.id,
                    startDate: new Date('2023-05-16'),
                    endDate: new Date('2023-06-15'),
                    tasks: [
                        { title: 'Training and Service Readiness', taskType: PhaseTask.TRAINING_SERVICE_READINESS, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Release Plan for Internal Field', taskType: PhaseTask.RELEASE_PLAN_INTERNAL_FIELD_PLANNED_BROAD, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Production Monitoring', taskType: PhaseTask.PRODUCTION_MONITORING, status: TaskStatus.TODO, priority: TaskPriority.HIGH },
                        { title: 'Metric Recording and Improvement Ops', taskType: PhaseTask.METRIC_RECORDING_IMPROVEMENT_OPS, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
                        { title: 'Deployment State Mapping', taskType: PhaseTask.DEPLOYMENT_STATE_MAPPING, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM }
                    ]
                }
            ];

            for (const phaseData of phases) {
                let phase = await workflowPhaseRepository.findOne({ where: { projectId: project.id, phaseType: phaseData.phaseType } });
                if (!phase) {
                    // Create phase without tasks first
                    const { tasks, ...phaseInfo } = phaseData;
                    phase = workflowPhaseRepository.create(phaseInfo);
                    await workflowPhaseRepository.save(phase);
                    logger.info(`Created phase: ${phase.phaseType}`);

                    // Create tasks
                    for (const taskData of tasks) {
                        const task = workflowTaskRepository.create({
                            ...taskData,
                            phaseId: phase.id,
                            projectId: project.id,
                            assignedTo: savedUsers[0], // assigning to first user by default
                            description: `Task for ${taskData.title}`
                        });
                        await workflowTaskRepository.save(task);
                    }
                } else {
                    logger.info(`Phase already exists: ${phase.phaseType}`);
                }
            }
        }

        // Create Allocations
        const allocationRepository = AppDataSource.getRepository(ProjectAllocation);
        const usersForAlloc = await userRepository.find();
        const projectsForAlloc = await projectRepository.find();

        if (usersForAlloc.length > 0 && projectsForAlloc.length > 0) {
            const allocations = [
                {
                    userId: usersForAlloc[0].id,
                    projectId: projectsForAlloc[0].id,
                    allocationPercentage: 50,
                    role: 'Product Owner',
                    startDate: new Date(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
                    isActive: true
                },
                {
                    userId: usersForAlloc[0].id,
                    projectId: projectsForAlloc[1].id,
                    allocationPercentage: 30,
                    role: 'Advisor',
                    startDate: new Date(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
                    isActive: true
                },
                {
                    userId: usersForAlloc[1].id,
                    projectId: projectsForAlloc[0].id,
                    allocationPercentage: 80,
                    role: 'Lead Developer',
                    startDate: new Date(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
                    isActive: true
                },
                {
                    userId: usersForAlloc[1].id,
                    projectId: projectsForAlloc[2].id,
                    allocationPercentage: 20,
                    role: 'Contributor',
                    startDate: new Date(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
                    isActive: true
                },
                {
                    userId: usersForAlloc[2].id,
                    projectId: projectsForAlloc[1].id,
                    allocationPercentage: 60,
                    role: 'DevOps Lead',
                    startDate: new Date(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 5)),
                    isActive: true
                },
                {
                    userId: usersForAlloc[2].id,
                    projectId: projectsForAlloc[2].id,
                    allocationPercentage: 40,
                    role: 'Security Engineer',
                    startDate: new Date(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 5)),
                    isActive: true
                }
            ];

            for (const allocData of allocations) {
                const existing = await allocationRepository.findOne({
                    where: {
                        userId: allocData.userId,
                        projectId: allocData.projectId
                    }
                });

                if (!existing) {
                    const allocation = allocationRepository.create(allocData);
                    await allocationRepository.save(allocation);
                    logger.info(`Created allocation for user ${allocData.userId} on project ${allocData.projectId}`);
                }
            }
        }


        logger.info('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
