"use strict";
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
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
var class_validator_1 = require("class-validator");
var UserModel_1 = require("../models/UserModel");
dotenv.config();
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.validateToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.status(200).json(true);
            }
            catch (error) {
                res.status(500).json(error);
            }
            return [2 /*return*/];
        });
    }); };
    // login 
    AuthController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, user, tkn, token, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password;
                    if (!(email && password)) {
                        res.status(500).json("user " + email + " and password " + password + " not found.");
                        // res.status(400).send();
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UserModel_1.User.findOne({ where: { email: email } })];
                case 2:
                    user = _b.sent();
                    //Check if encrypted password match
                    if (!(user === null || user === void 0 ? void 0 : user.checkIfUnencryptedPasswordIsValid(password))) {
                        res.status(401).send();
                        return [2 /*return*/];
                    }
                    //Sing JWT, valid for 1 hour
                    user.password = undefined;
                    tkn = process.env.jwtSecret + '';
                    token = jwt.sign({ userId: user.id, email: user === null || user === void 0 ? void 0 : user.email }, tkn, { expiresIn: "1h" });
                    //Send the jwt in the response
                    res.send({ token: token, user: user });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.log(error_1);
                    res.status(401).send();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // change password
    AuthController.changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, oldPassword, newPassword, user, errors, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = res.locals.jwtPayload.userId;
                    _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                    if (!(oldPassword && newPassword)) {
                        res.status(400).send();
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, UserModel_1.User.findOne({ where: { id: id } })];
                case 2:
                    user = _b.sent();
                    //Check if old password matchs
                    if (!(user === null || user === void 0 ? void 0 : user.checkIfUnencryptedPasswordIsValid(oldPassword))) {
                        res.status(401).send();
                        return [2 /*return*/];
                    }
                    //Validate de model (password lenght)
                    user.password = newPassword;
                    return [4 /*yield*/, class_validator_1.validate(user)];
                case 3:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).json(errors);
                        return [2 /*return*/];
                    }
                    //Hash the new password and save
                    user.hashPassword();
                    user.save();
                    res.status(204).send();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    console.log(error_2);
                    res.status(401).json(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return AuthController;
}());
exports["default"] = AuthController;
