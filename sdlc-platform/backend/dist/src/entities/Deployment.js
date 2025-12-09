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
exports.Deployment = exports.Environment = exports.DeploymentType = exports.DeploymentStatus = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const User_1 = require("./User");
var DeploymentStatus;
(function (DeploymentStatus) {
    DeploymentStatus["PLANNED"] = "planned";
    DeploymentStatus["IN_PROGRESS"] = "in_progress";
    DeploymentStatus["COMPLETED"] = "completed";
    DeploymentStatus["FAILED"] = "failed";
    DeploymentStatus["ROLLED_BACK"] = "rolled_back";
})(DeploymentStatus || (exports.DeploymentStatus = DeploymentStatus = {}));
var DeploymentType;
(function (DeploymentType) {
    DeploymentType["TECHNICAL"] = "technical";
    DeploymentType["COMMERCIAL"] = "commercial";
})(DeploymentType || (exports.DeploymentType = DeploymentType = {}));
var Environment;
(function (Environment) {
    Environment["DEV"] = "development";
    Environment["QA"] = "qa";
    Environment["STAGING"] = "staging";
    Environment["UAT"] = "uat";
    Environment["PRODUCTION"] = "production";
})(Environment || (exports.Environment = Environment = {}));
let Deployment = class Deployment {
    // Virtual property for deployment status color
    get statusColor() {
        const colors = {
            [DeploymentStatus.PLANNED]: 'blue',
            [DeploymentStatus.IN_PROGRESS]: 'orange',
            [DeploymentStatus.COMPLETED]: 'green',
            [DeploymentStatus.FAILED]: 'red',
            [DeploymentStatus.ROLLED_BACK]: 'purple'
        };
        return colors[this.status] || 'gray';
    }
    // Virtual property to check if deployment is active
    get isActive() {
        return [DeploymentStatus.PLANNED, DeploymentStatus.IN_PROGRESS].includes(this.status);
    }
};
exports.Deployment = Deployment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Deployment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Deployment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Deployment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Deployment.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Deployment.prototype, "environment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Deployment.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "releaseNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Deployment.prototype, "plannedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "actualStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "completionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Deployment.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Deployment.prototype, "deployedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "approvedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Deployment.prototype, "isAutomated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "deploymentPlan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "rollbackPlan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deployment.prototype, "postDeploymentValidation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, project => project.deployments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", Project_1.Project)
], Deployment.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'deployedById' }),
    __metadata("design:type", User_1.User)
], Deployment.prototype, "deployedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approvedById' }),
    __metadata("design:type", Object)
], Deployment.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Deployment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Deployment.prototype, "updatedAt", void 0);
exports.Deployment = Deployment = __decorate([
    (0, typeorm_1.Entity)('deployments')
], Deployment);
