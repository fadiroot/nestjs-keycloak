"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var jwt_access_startegy_1 = require("./strategies/jwt-access.startegy");
var validateKeycloakSchema_1 = require("./keycloack/validateKeycloakSchema");
var config_1 = require("@nestjs/config");
var nest_keycloak_connect_1 = require("nest-keycloak-connect");
var axios_1 = require("@nestjs/axios");
var keycloak_config_1 = require("./keycloack/keycloak.config");
var keycloak_service_1 = require("./keycloack/keycloak.service");
var typeorm_1 = require("@nestjs/typeorm");
var auth_entity_1 = require("./entities/auth.entity");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([auth_entity_1.User]),
                axios_1.HttpModule,
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: validateKeycloakSchema_1.configValidationSchema
                }),
                nest_keycloak_connect_1.KeycloakConnectModule.register({
                    authServerUrl: 'http://localhost:8080',
                    realm: 'softylines',
                    clientId: 'nestjs-app',
                    secret: 'ypf4DWhWLZEcnwuC6IaQUTfEdg4qrwVP',
                    policyEnforcement: nest_keycloak_connect_1.PolicyEnforcementMode.PERMISSIVE,
                    tokenValidation: nest_keycloak_connect_1.TokenValidation.ONLINE
                }),
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, jwt_access_startegy_1.JwtStrategy, keycloak_config_1.KeycloakConfigService, keycloak_service_1.KeycloakService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
