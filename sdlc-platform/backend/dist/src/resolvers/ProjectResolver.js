"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Project_1 = require("../entities/Project");
const typeorm_1 = require("typeorm");
let ProjectResolver = class ProjectResolver {
    constructor() {
        this.projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    }
    async projects() {
        return this.projectRepository.find({ relations: ['owner', 'lead'] });
    }
    async project(id) {
        return this.projectRepository.findOne({ where: { id }, relations: ['owner', 'lead'] }) || null; // Ensure null is returned
    }
    async createProject(name, description, ownerId) {
        const project = this.projectRepository.create({
            name,
            description,
            status: Project_1.ProjectStatus.PLANNING,
            ownerId,
        });
        return this.projectRepository.save(project);
    }
};
exports.ProjectResolver = ProjectResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Project_1.Project]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "projects", null);
__decorate([
    (0, type_graphql_1.Query)(() => Project_1.Project, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "project", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Project_1.Project),
    __param(0, (0, type_graphql_1.Arg)('name')),
    __param(1, (0, type_graphql_1.Arg)('description')),
    __param(2, (0, type_graphql_1.Arg)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "createProject", null);
exports.ProjectResolver = ProjectResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProjectResolver);
