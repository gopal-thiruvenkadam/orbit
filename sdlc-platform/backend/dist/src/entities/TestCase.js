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
exports.TestCase = exports.TestType = exports.TestStatus = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const Requirement_1 = require("./Requirement");
const User_1 = require("./User");
const TestRun_1 = require("./TestRun");
var TestStatus;
(function (TestStatus) {
    TestStatus["DRAFT"] = "draft";
    TestStatus["READY"] = "ready";
    TestStatus["RUNNING"] = "running";
    TestStatus["PASSED"] = "passed";
    TestStatus["FAILED"] = "failed";
    TestStatus["BLOCKED"] = "blocked";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
var TestType;
(function (TestType) {
    TestType["UNIT"] = "unit";
    TestType["INTEGRATION"] = "integration";
    TestType["SYSTEM"] = "system";
    TestType["PERFORMANCE"] = "performance";
    TestType["SECURITY"] = "security";
    TestType["USABILITY"] = "usability";
    TestType["REGRESSION"] = "regression";
    TestType["ACCEPTANCE"] = "acceptance";
    TestType["REGULATORY"] = "regulatory";
})(TestType || (exports.TestType = TestType = {}));
let TestCase = class TestCase {
    // Virtual property for test status color
    get statusColor() {
        const colors = {
            [TestStatus.DRAFT]: 'gray',
            [TestStatus.READY]: 'blue',
            [TestStatus.RUNNING]: 'orange',
            [TestStatus.PASSED]: 'green',
            [TestStatus.FAILED]: 'red',
            [TestStatus.BLOCKED]: 'purple'
        };
        return colors[this.status] || 'gray';
    }
};
exports.TestCase = TestCase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TestCase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TestCase.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TestCase.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], TestCase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], TestCase.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], TestCase.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TestCase.prototype, "prerequisites", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TestCase.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TestCase.prototype, "expectedResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TestCase.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TestCase.prototype, "requirementId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TestCase.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TestCase.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TestCase.prototype, "isAutomated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TestCase.prototype, "automationScript", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, project => project.testCases, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", Project_1.Project)
], TestCase.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Requirement_1.Requirement, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'requirementId' }),
    __metadata("design:type", Object)
], TestCase.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", User_1.User)
], TestCase.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", Object)
], TestCase.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TestRun_1.TestRun, testRun => testRun.testCase),
    __metadata("design:type", Array)
], TestCase.prototype, "testRuns", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TestCase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TestCase.prototype, "updatedAt", void 0);
exports.TestCase = TestCase = __decorate([
    (0, typeorm_1.Entity)('test_cases')
], TestCase);
