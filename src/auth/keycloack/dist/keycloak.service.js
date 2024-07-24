"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.KeycloakService = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var typeorm_1 = require("@nestjs/typeorm");
var auth_entity_1 = require("../entities/auth.entity");
var KeycloakService = /** @class */ (function () {
    function KeycloakService(httpService, configService, userRepository) {
        this.httpService = httpService;
        this.configService = configService;
        this.userRepository = userRepository;
        this.keycloakUrl = this.configService.get('KEYCLOAK_BASE_URL');
        this.realm = this.configService.get('KEYCLOAK_REALM');
        this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
        this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
    }
    KeycloakService.prototype.signup = function (firstName, lastName, username, email, password) {
        return __awaiter(this, void 0, Promise, function () {
            var adminToken, userUrl, headers, userData, user, error_1, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getAdminToken()];
                    case 1:
                        adminToken = _a.sent();
                        userUrl = this.keycloakUrl + "/admin/realms/" + this.realm + "/users";
                        headers = {
                            'Content-Type': 'application/json',
                            Authorization: "bearer " + adminToken
                        };
                        userData = {
                            username: username,
                            email: email,
                            enabled: true,
                            firstName: firstName,
                            lastName: lastName,
                            credentials: [
                                {
                                    type: 'password',
                                    value: password,
                                    temporary: false
                                },
                            ]
                        };
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.httpService.post(userUrl, userData, { headers: headers }))];
                    case 2:
                        _a.sent();
                        user = new auth_entity_1.User();
                        user.username = firstName;
                        user.email = email;
                        user.password = password;
                        console.log(user);
                        return [2 /*return*/, { message: 'user register successfully' }];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1.response) {
                            status = error_1.response.status;
                            if (status === 409) {
                                return [2 /*return*/, { message: 'the user already exist' }];
                            }
                        }
                        else {
                            throw new Error(error_1);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KeycloakService.prototype.registerUser = function (firstName, email, password) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = new auth_entity_1.User();
                        user.username = firstName;
                        user.email = email;
                        user.password = password;
                        console.log(user);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { message: 'user register successfully' }];
                }
            });
        });
    };
    KeycloakService.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAccessToken(username, password)];
                    case 1:
                        accessToken = _a.sent();
                        // Step 2: Use access token to fetch user data
                        return [2 /*return*/, { accessToken: accessToken }];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    KeycloakService.prototype.getAdminToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, params, tokenResponse, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.keycloakUrl + "/realms/" + this.realm + "/protocol/openid-connect/token";
                        params = new URLSearchParams();
                        params.append('grant_type', 'client_credentials');
                        params.append('client_id', this.clientId);
                        params.append('client_secret', this.clientSecret);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.httpService.post(url, params))];
                    case 2:
                        tokenResponse = _a.sent();
                        return [2 /*return*/, tokenResponse.data.access_token];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error('Failed to obtain admin token');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KeycloakService.prototype.getAccessToken = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var url, params, tokenResponse, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.keycloakUrl + "/realms/" + this.realm + "/protocol/openid-connect/token";
                        params = new URLSearchParams();
                        params.append('grant_type', 'password');
                        params.append('client_id', this.clientId);
                        params.append('client_secret', this.clientSecret);
                        params.append('username', username);
                        params.append('password', password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.httpService.post(url, params))];
                    case 2:
                        tokenResponse = _a.sent();
                        return [2 /*return*/, tokenResponse.data.access_token];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error('Failed to obtain access token');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KeycloakService.prototype.getUserInfo = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.keycloakUrl + "/realms/" + this.realm + "/protocol/openid-connect/userinfo";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.httpService.get(url, {
                                headers: {
                                    Authorization: "Bearer " + accessToken
                                }
                            }))];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_5 = _a.sent();
                        throw new Error('Failed to fetch user information');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KeycloakService = __decorate([
        common_1.Injectable(),
        __param(2, typeorm_1.InjectRepository(auth_entity_1.User))
    ], KeycloakService);
    return KeycloakService;
}());
exports.KeycloakService = KeycloakService;
