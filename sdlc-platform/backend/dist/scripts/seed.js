"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../src/entities/User");
const Project_1 = require("../src/entities/Project");
const data_source_1 = require("../src/config/data-source");
const logger_1 = require("../src/utils/logger");
async function seed() {
    try {
        await data_source_1.AppDataSource.initialize();
        logger_1.logger.info('Database connection established for seeding');
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const projectRepository = data_source_1.AppDataSource.getRepository(Project_1.Project);
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
                logger_1.logger.info(`Created user: ${user.email}`);
            }
            else {
                logger_1.logger.info(`User already exists: ${user.email}`);
            }
            savedUsers.push(user);
        }
        // Create Projects
        const projects = [
            {
                name: 'SDLC Platform Development',
                description: 'Development of the SDLC Management Platform',
                status: Project_1.ProjectStatus.IN_PROGRESS,
                owner: savedUsers[0],
                lead: savedUsers[1],
                progress: 45,
                currentPhase: 'Development',
            },
            {
                name: 'API Integration Service',
                description: 'Service for integrating with external APIs',
                status: Project_1.ProjectStatus.PLANNING,
                owner: savedUsers[1],
                lead: savedUsers[2],
                progress: 15,
                currentPhase: 'Planning',
            },
            {
                name: 'Authentication Module',
                description: 'User authentication and authorization module',
                status: Project_1.ProjectStatus.IN_PROGRESS,
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
                logger_1.logger.info(`Created project: ${project.name}`);
            }
            else {
                logger_1.logger.info(`Project already exists: ${project.name}`);
            }
        }
        logger_1.logger.info('Seeding completed successfully');
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Error seeding database:', error);
        process.exit(1);
    }
}
seed();
