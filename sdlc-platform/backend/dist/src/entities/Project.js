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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.ProjectStatus = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const Requirement_1 = require("./Requirement");
const TestCase_1 = require("./TestCase");
const Deployment_1 = require("./Deployment");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["IN_PROGRESS"] = "in_progress";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
(0, type_graphql_1.registerEnumType)(ProjectStatus, {
    name: 'ProjectStatus',
    description: 'The status of the project',
});
let Project = class Project {
    // Virtual property for project duration in days
    get durationInDays() {
        if (!this.startDate)
            return null;
        const endDate = this.actualEndDate || new Date();
        const diffTime = Math.abs(endDate.getTime() - this.startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    // Virtual property to check if project is active
    get isActive() {
        return [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS].includes(this.status);
    }
};
exports.Project = Project;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ProjectStatus),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { defaultValue: 0 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "currentPhase", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "targetEndDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "actualEndDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Project.prototype, "ownerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "leadId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.ownedProjects, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", User_1.User)
], Project.prototype, "owner", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.leadProjects, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'leadId' }),
    __metadata("design:type", Object)
], Project.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Requirement_1.Requirement, (requirement) => requirement.project),
    __metadata("design:type", Array)
], Project.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TestCase_1.TestCase, (testCase) => testCase.project),
    __metadata("design:type", Array)
], Project.prototype, "testCases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Deployment_1.Deployment, (deployment) => deployment.project),
    __metadata("design:type", Array)
], Project.prototype, "deployments", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Project.prototype, "durationInDays", null);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], Project.prototype, "isActive", null);
exports.Project = Project = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('projects')
], Project);
