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
exports.Requirement = exports.RequirementType = exports.RequirementStatus = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const User_1 = require("./User");
var RequirementStatus;
(function (RequirementStatus) {
    RequirementStatus["DRAFT"] = "draft";
    RequirementStatus["IN_REVIEW"] = "in_review";
    RequirementStatus["APPROVED"] = "approved";
    RequirementStatus["IMPLEMENTED"] = "implemented";
    RequirementStatus["REJECTED"] = "rejected";
    RequirementStatus["DEPRECATED"] = "deprecated";
})(RequirementStatus || (exports.RequirementStatus = RequirementStatus = {}));
var RequirementType;
(function (RequirementType) {
    RequirementType["FUNCTIONAL"] = "functional";
    RequirementType["NON_FUNCTIONAL"] = "non_functional";
    RequirementType["TECHNICAL"] = "technical";
    RequirementType["BUSINESS"] = "business";
    RequirementType["USER"] = "user";
    RequirementType["SYSTEM"] = "system";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
let Requirement = class Requirement {
    // Virtual property for requirement status color
    get statusColor() {
        const colors = {
            [RequirementStatus.DRAFT]: 'gray',
            [RequirementStatus.IN_REVIEW]: 'blue',
            [RequirementStatus.APPROVED]: 'green',
            [RequirementStatus.IMPLEMENTED]: 'purple',
            [RequirementStatus.REJECTED]: 'red',
            [RequirementStatus.DEPRECATED]: 'orange'
        };
        return colors[this.status] || 'gray';
    }
    // Virtual property for priority color
    get priorityColor() {
        const colors = {
            'low': 'green',
            'medium': 'blue',
            'high': 'orange',
            'critical': 'red'
        };
        return colors[this.priority] || 'gray';
    }
};
exports.Requirement = Requirement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Requirement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Requirement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Requirement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: RequirementStatus.DRAFT }),
    __metadata("design:type", String)
], Requirement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: RequirementType.FUNCTIONAL }),
    __metadata("design:type", String)
], Requirement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Requirement.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Requirement.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Requirement.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Requirement.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.requirements, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", Project_1.Project)
], Requirement.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", User_1.User)
], Requirement.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", Object)
], Requirement.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Requirement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Requirement.prototype, "updatedAt", void 0);
exports.Requirement = Requirement = __decorate([
    (0, typeorm_1.Entity)('requirements')
], Requirement);
