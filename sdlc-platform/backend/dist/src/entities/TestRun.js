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
exports.TestRun = exports.TestResult = void 0;
const typeorm_1 = require("typeorm");
const TestCase_1 = require("./TestCase");
const User_1 = require("./User");
var TestResult;
(function (TestResult) {
    TestResult["PASSED"] = "passed";
    TestResult["FAILED"] = "failed";
    TestResult["BLOCKED"] = "blocked";
    TestResult["SKIPPED"] = "skipped";
    TestResult["NOT_RUN"] = "not_run";
})(TestResult || (exports.TestResult = TestResult = {}));
let TestRun = class TestRun {
    // Virtual property for test result color
    get resultColor() {
        const colors = {
            [TestResult.PASSED]: 'green',
            [TestResult.FAILED]: 'red',
            [TestResult.BLOCKED]: 'purple',
            [TestResult.SKIPPED]: 'orange',
            [TestResult.NOT_RUN]: 'gray'
        };
        return colors[this.result] || 'gray';
    }
};
exports.TestRun = TestRun;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TestRun.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], TestRun.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "actualResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TestRun.prototype, "testCaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TestRun.prototype, "executedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "environment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "errorDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TestRun.prototype, "isAutomated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TestRun.prototype, "attachmentUrls", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TestCase_1.TestCase, testCase => testCase.testRuns, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'testCaseId' }),
    __metadata("design:type", TestCase_1.TestCase)
], TestRun.prototype, "testCase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'executedById' }),
    __metadata("design:type", User_1.User)
], TestRun.prototype, "executedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TestRun.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TestRun.prototype, "updatedAt", void 0);
exports.TestRun = TestRun = __decorate([
    (0, typeorm_1.Entity)('test_runs')
], TestRun);
