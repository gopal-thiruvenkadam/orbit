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
exports.QualityManagement = exports.QMDeliverable = exports.QMStatus = exports.QMPhase = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const User_1 = require("./User");
var QMPhase;
(function (QMPhase) {
    QMPhase["BUILDING_PHASE"] = "building_phase";
    QMPhase["QA"] = "qa";
    QMPhase["UAT"] = "uat";
    QMPhase["SQA_SQCT"] = "sqa_sqct";
    QMPhase["ENVIRONMENT_RECORD"] = "environment_record";
})(QMPhase || (exports.QMPhase = QMPhase = {}));
var QMStatus;
(function (QMStatus) {
    QMStatus["NOT_STARTED"] = "not_started";
    QMStatus["IN_PROGRESS"] = "in_progress";
    QMStatus["COMPLETED"] = "completed";
    QMStatus["BLOCKED"] = "blocked";
})(QMStatus || (exports.QMStatus = QMStatus = {}));
var QMDeliverable;
(function (QMDeliverable) {
    QMDeliverable["BUILDING_PHASE_DESIGN_INPUTS"] = "building_phase_design_inputs";
    QMDeliverable["BUILDING_PHASE_TRACE"] = "building_phase_trace";
    QMDeliverable["QA_ARCHITECTURE_PATTERNS_SPEC"] = "qa_architecture_patterns_spec";
    QMDeliverable["QA_INTEGRATION_DOCUMENT"] = "qa_integration_document";
    QMDeliverable["QA_TTP"] = "qa_ttp";
    QMDeliverable["UAT_ACCEPTANCE_TEST_PLAN"] = "uat_acceptance_test_plan";
    QMDeliverable["SQA_SQCT_TEST_CASE"] = "sqa_sqct_test_case";
    QMDeliverable["SQA_SQCT_TEST_REPORTS"] = "sqa_sqct_test_reports";
    QMDeliverable["SQA_SQCT_GXP"] = "sqa_sqct_gxp";
    QMDeliverable["ENVIRONMENT_RECORD_DVSRS"] = "environment_record_dvsrs";
    QMDeliverable["ENVIRONMENT_RECORD_URS_RECORDS"] = "environment_record_urs_records";
})(QMDeliverable || (exports.QMDeliverable = QMDeliverable = {}));
let QualityManagement = class QualityManagement {
    // Get the name of the phase
    get phaseName() {
        const phaseNames = {
            [QMPhase.BUILDING_PHASE]: 'Building Phase',
            [QMPhase.QA]: 'QA',
            [QMPhase.UAT]: 'UAT',
            [QMPhase.SQA_SQCT]: 'SQA/SQCT',
            [QMPhase.ENVIRONMENT_RECORD]: 'Environment Record'
        };
        return phaseNames[this.phase] || 'Unknown Phase';
    }
    // Get the color for the status
    get statusColor() {
        const colors = {
            [QMStatus.NOT_STARTED]: 'gray',
            [QMStatus.IN_PROGRESS]: 'blue',
            [QMStatus.COMPLETED]: 'green',
            [QMStatus.BLOCKED]: 'red'
        };
        return colors[this.status] || 'gray';
    }
    // Check if all required deliverables for the current phase are completed
    get isDeliverableCompleted() {
        const requiredDeliverables = {
            [QMPhase.BUILDING_PHASE]: ['building_phase_design_inputs', 'building_phase_trace'],
            [QMPhase.QA]: ['qa_architecture_patterns_spec', 'qa_integration_document', 'qa_ttp'],
            [QMPhase.UAT]: ['uat_acceptance_test_plan'],
            [QMPhase.SQA_SQCT]: ['sqa_sqct_test_case', 'sqa_sqct_test_reports', 'sqa_sqct_gxp'],
            [QMPhase.ENVIRONMENT_RECORD]: ['environment_record_dvsrs', 'environment_record_urs_records']
        };
        const required = requiredDeliverables[this.phase] || [];
        return required.every(deliverable => { var _a; return ((_a = this.deliverables[deliverable]) === null || _a === void 0 ? void 0 : _a.completed) === true; });
    }
};
exports.QualityManagement = QualityManagement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QualityManagement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], QualityManagement.prototype, "phase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], QualityManagement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QualityManagement.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QualityManagement.prototype, "responsibleUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], QualityManagement.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], QualityManagement.prototype, "completionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], QualityManagement.prototype, "deliverables", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], QualityManagement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", Project_1.Project)
], QualityManagement.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'responsibleUserId' }),
    __metadata("design:type", User_1.User)
], QualityManagement.prototype, "responsibleUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QualityManagement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QualityManagement.prototype, "updatedAt", void 0);
exports.QualityManagement = QualityManagement = __decorate([
    (0, typeorm_1.Entity)('quality_management')
], QualityManagement);
