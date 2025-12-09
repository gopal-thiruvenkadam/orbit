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
exports.WorkflowTask = exports.PhaseTask = exports.TaskPriority = exports.TaskStatus = void 0;
const typeorm_1 = require("typeorm");
const WorkflowPhase_1 = require("./WorkflowPhase");
const User_1 = require("./User");
const Project_1 = require("./Project");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["IN_REVIEW"] = "in_review";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["BLOCKED"] = "blocked";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["CRITICAL"] = "critical";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
// This enum reflects the tasks from the Product Engineering Workflow diagram
var PhaseTask;
(function (PhaseTask) {
    // Phase 1: Strategic Planning and Inception
    PhaseTask["PROJECT_DEFINITION"] = "project_definition";
    PhaseTask["THREAT_MODELING"] = "threat_modeling";
    PhaseTask["DFT_CREATION"] = "dft_creation";
    PhaseTask["PROJECT_RISK_ISSUES_ASSESSMENT"] = "project_risk_issues_assessment";
    PhaseTask["REGULATORY_ASSESSMENT"] = "regulatory_assessment";
    PhaseTask["REQUIREMENTS_ENGINEERING"] = "requirements_engineering";
    PhaseTask["RESOURCE_BUDGET_PLANNING"] = "resource_budget_planning";
    PhaseTask["TRACEABILITY_MATRIX_CREATION"] = "traceability_matrix_creation";
    PhaseTask["CRITICAL_WORKFLOW_ANALYSIS"] = "critical_workflow_analysis";
    PhaseTask["PRODUCT_FUNCTION_DEVELOPMENT"] = "product_function_development";
    PhaseTask["JIRA_API_QUALITY_INTEGRATION"] = "jira_api_quality_integration";
    // Phase 2: Architecture and System Design
    PhaseTask["FORMAL_ARCHITECTURE_DEVELOPMENT"] = "formal_architecture_development";
    PhaseTask["MODULE_DESIGN_WITH_FEATURE_SIGN_OFF"] = "module_design_with_feature_sign_off";
    PhaseTask["INTERFACE_DESIGN"] = "interface_design";
    PhaseTask["UI_DESIGN"] = "ui_design";
    PhaseTask["DATA_UX_DATA_PRIVACY_DESIGN"] = "data_ux_data_privacy_design";
    PhaseTask["SECURITY_DESIGN_THREAT_MODELING"] = "security_design_threat_modeling";
    PhaseTask["OBSERVABILITY_DESIGN"] = "observability_design";
    PhaseTask["FMEA_ANALYSIS_DESIGN"] = "fmea_analysis_design";
    PhaseTask["TEST_DESIGN"] = "test_design";
    PhaseTask["OPERATIONS_ANALYTICS_DESIGN"] = "operations_analytics_design";
    PhaseTask["PROJECT_GMP"] = "project_gmp";
    PhaseTask["COMPREHENSIVE_TEST_PLANNING_READY"] = "comprehensive_test_planning_ready";
    PhaseTask["INITIAL_FMEA_REPORTS"] = "initial_fmea_reports";
    // Phase 3: Implementation and Construction
    PhaseTask["ENVIRONMENT_SET_UP"] = "environment_set_up";
    PhaseTask["CODE_IMPLEMENTATION"] = "code_implementation";
    PhaseTask["CI_CD_PIPELINES"] = "ci_cd_pipelines";
    PhaseTask["AUTOMATED_UNIT_INTEGRATION_WITH_DAY_COMPONENTS"] = "automated_unit_integration_with_day_components";
    PhaseTask["BUILD_MERGE_ANALYSIS_CODE_INTEGRATION"] = "build_merge_analysis_code_integration";
    PhaseTask["OBSERVABILITY_OPERATIONAL_ENV_IMPLEMENTATION"] = "observability_operational_env_implementation";
    PhaseTask["ERROR_AUDIT_CONFIG_IMPLEMENTATION"] = "error_audit_config_implementation";
    PhaseTask["TECH_DESIGN_SUPPORT_TOOLS_DESIGN_IMPLEMENTATION"] = "tech_design_support_tools_design_implementation";
    PhaseTask["CLOUD_INFRASTRUCTURE_AUTOMATION"] = "cloud_infrastructure_automation";
    PhaseTask["SCA_CODE_ANALYSIS_REPORTS"] = "sca_code_analysis_reports";
    PhaseTask["EVIDENCE_REPORTS_SPECS_TEST_COVERAGE"] = "evidence_reports_specs_test_coverage";
    PhaseTask["TECHNICAL_DESIGN"] = "technical_design";
    PhaseTask["OPERATIONAL_IMPLEMENTATION_REPORTS"] = "operational_implementation_reports";
    // Phase 4: Comprehensive Testing and Validation
    PhaseTask["UNIT_DIRECTIVE_TESTING"] = "unit_directive_testing";
    PhaseTask["SYSTEM_E2E_TESTING"] = "system_e2e_testing";
    PhaseTask["CRITICAL_WORKFLOW_TESTING"] = "critical_workflow_testing";
    PhaseTask["REGULATORY_VALIDATION"] = "regulatory_validation";
    PhaseTask["SECURITY_TESTING"] = "security_testing";
    PhaseTask["DATA_VALIDATION"] = "data_validation";
    PhaseTask["LOAD_PERFORMANCE_TESTING"] = "load_performance_testing";
    PhaseTask["UX_USABILITY_ACCESSIBILITY_TESTING"] = "ux_usability_accessibility_testing";
    PhaseTask["OBSERVABILITY_ANALYTICS_TESTING"] = "observability_analytics_testing";
    PhaseTask["SERVICE_SUPPORT_TOOLS_TESTING"] = "service_support_tools_testing";
    PhaseTask["TEST_REPORTS"] = "test_reports";
    PhaseTask["RISK_FMEA_REPORTS"] = "risk_fmea_reports";
    PhaseTask["PROGRESS_BUG_REPORTS_KPIS"] = "progress_bug_reports_kpis";
    // Phase 5: Deployment and Operational Readiness
    PhaseTask["TRAINING_SERVICE_READINESS"] = "training_service_readiness";
    PhaseTask["RELEASE_PLAN_INTERNAL_FIELD_PLANNED_BROAD"] = "release_plan_internal_field_planned_broad";
    PhaseTask["PRODUCTION_MONITORING"] = "production_monitoring";
    PhaseTask["METRIC_RECORDING_IMPROVEMENT_OPS"] = "metric_recording_improvement_ops";
    PhaseTask["DEPLOYMENT_STATE_MAPPING"] = "deployment_state_mapping";
    PhaseTask["COMPLETE_SERVICE_DEPLOYMENT_ORCHESTRATION"] = "complete_service_deployment_orchestration";
    PhaseTask["DEPLOYMENT_PLAN_REPORTS"] = "deployment_plan_reports";
    PhaseTask["PRODUCTION_DOCUMENTATION_REVIEWS_ARCHIVES"] = "production_documentation_reviews_archives";
    PhaseTask["OPERATIONAL_READINESS_ENVIRONMENT_VALIDATION"] = "operational_readiness_environment_validation";
    PhaseTask["TECHNICAL_COMMERCIAL_RELEASE_NOTES"] = "technical_commercial_release_notes";
})(PhaseTask || (exports.PhaseTask = PhaseTask = {}));
let WorkflowTask = class WorkflowTask {
    // Get status color
    get statusColor() {
        const colors = {
            [TaskStatus.TODO]: 'gray',
            [TaskStatus.IN_PROGRESS]: 'blue',
            [TaskStatus.IN_REVIEW]: 'purple',
            [TaskStatus.COMPLETED]: 'green',
            [TaskStatus.BLOCKED]: 'red'
        };
        return colors[this.status] || 'gray';
    }
    // Get priority color
    get priorityColor() {
        const colors = {
            [TaskPriority.LOW]: 'green',
            [TaskPriority.MEDIUM]: 'blue',
            [TaskPriority.HIGH]: 'orange',
            [TaskPriority.CRITICAL]: 'red'
        };
        return colors[this.priority] || 'gray';
    }
};
exports.WorkflowTask = WorkflowTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkflowTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkflowTask.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], WorkflowTask.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], WorkflowTask.prototype, "taskType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], WorkflowTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], WorkflowTask.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkflowTask.prototype, "phaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkflowTask.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], WorkflowTask.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], WorkflowTask.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WorkflowTask.prototype, "deliverables", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WorkflowTask.prototype, "integrations", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WorkflowPhase_1.WorkflowPhase, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'phaseId' }),
    __metadata("design:type", WorkflowPhase_1.WorkflowPhase)
], WorkflowTask.prototype, "phase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", Project_1.Project)
], WorkflowTask.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", Object)
], WorkflowTask.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkflowTask.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkflowTask.prototype, "updatedAt", void 0);
exports.WorkflowTask = WorkflowTask = __decorate([
    (0, typeorm_1.Entity)('workflow_tasks')
], WorkflowTask);
