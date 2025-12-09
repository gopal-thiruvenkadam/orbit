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
exports.WorkflowPhase = exports.PhaseStatus = exports.PhaseType = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
var PhaseType;
(function (PhaseType) {
    PhaseType["PLANNING"] = "planning";
    PhaseType["ARCHITECTURE"] = "architecture";
    PhaseType["IMPLEMENTATION"] = "implementation";
    PhaseType["TESTING"] = "testing";
    PhaseType["DEPLOYMENT"] = "deployment"; // Deployment and Operational Readiness
})(PhaseType || (exports.PhaseType = PhaseType = {}));
var PhaseStatus;
(function (PhaseStatus) {
    PhaseStatus["NOT_STARTED"] = "not_started";
    PhaseStatus["IN_PROGRESS"] = "in_progress";
    PhaseStatus["COMPLETED"] = "completed";
    PhaseStatus["ON_HOLD"] = "on_hold";
})(PhaseStatus || (exports.PhaseStatus = PhaseStatus = {}));
let WorkflowPhase = class WorkflowPhase {
    // Get the name of the phase based on the phase type
    get phaseName() {
        const phaseNames = {
            [PhaseType.PLANNING]: 'Strategic Planning and Inception',
            [PhaseType.ARCHITECTURE]: 'Architecture and System Design',
            [PhaseType.IMPLEMENTATION]: 'Implementation and Construction',
            [PhaseType.TESTING]: 'Comprehensive Testing and Validation',
            [PhaseType.DEPLOYMENT]: 'Deployment and Operational Readiness'
        };
        return phaseNames[this.phaseType] || 'Unknown Phase';
    }
    // Get the color for the phase status
    get statusColor() {
        const colors = {
            [PhaseStatus.NOT_STARTED]: 'gray',
            [PhaseStatus.IN_PROGRESS]: 'blue',
            [PhaseStatus.COMPLETED]: 'green',
            [PhaseStatus.ON_HOLD]: 'orange'
        };
        return colors[this.status] || 'gray';
    }
    // Check if the phase is active
    get isActive() {
        return this.status === PhaseStatus.IN_PROGRESS;
    }
};
exports.WorkflowPhase = WorkflowPhase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkflowPhase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], WorkflowPhase.prototype, "phaseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], WorkflowPhase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkflowPhase.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], WorkflowPhase.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], WorkflowPhase.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], WorkflowPhase.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WorkflowPhase.prototype, "deliverables", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WorkflowPhase.prototype, "milestones", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", Project_1.Project)
], WorkflowPhase.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkflowPhase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkflowPhase.prototype, "updatedAt", void 0);
exports.WorkflowPhase = WorkflowPhase = __decorate([
    (0, typeorm_1.Entity)('workflow_phases')
], WorkflowPhase);
