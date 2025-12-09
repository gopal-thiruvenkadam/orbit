"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_core_1 = require("apollo-server-core");
const logger_1 = require("./utils/logger");
const UserResolver_1 = require("./resolvers/UserResolver");
const ProjectResolver_1 = require("./resolvers/ProjectResolver");
const data_source_1 = require("./config/data-source");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
async function bootstrap() {
    try {
        // Initialize database connection
        await data_source_1.AppDataSource.initialize();
        logger_1.logger.info('Database connection established');
        // Create Express app
        const app = (0, express_1.default)();
        // Middleware
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        // Create GraphQL server
        const server = new apollo_server_express_1.ApolloServer({
            schema: await (0, type_graphql_1.buildSchema)({
                resolvers: [UserResolver_1.UserResolver, ProjectResolver_1.ProjectResolver],
                validate: false,
            }),
            context: ({ req, res }) => ({ req, res }),
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        });
        await server.start();
        server.applyMiddleware({ app: app, cors: false });
        // Health check endpoint
        app.get('/health', (_, res) => {
            res.status(200).json({ status: 'ok' });
        });
        // Start server
        app.listen(PORT, () => {
            logger_1.logger.info(`Server is running on http://localhost:${PORT}/graphql`);
        });
    }
    catch (error) {
        logger_1.logger.error('Error starting server:', error);
        process.exit(1);
    }
}
bootstrap();
