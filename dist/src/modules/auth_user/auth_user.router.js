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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseAdmin_1 = __importDefault(require("../../../firebaseAdmin"));
const authUserRouter = (0, express_1.Router)();
authUserRouter.post("/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userId, role } = req.body;
    try {
        // Validate email, password, userId, and roles
        if (!email || !password || !userId || !role) {
            return res
                .status(400)
                .send("Email, password, userId, and roles are required");
        }
        // Create the user
        const userRecord = yield firebaseAdmin_1.default.auth().createUser({
            email: email,
            password: password,
            uid: userId, // Set the user ID
        });
        // Add custom claims (roles) to the user
        yield firebaseAdmin_1.default.auth().setCustomUserClaims(userId, { role });
        // Return the user ID
        res.status(201).json({ userId: userRecord.uid });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal server error");
    }
}));
authUserRouter.put("/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { email } = req.body;
    try {
        // Validate email
        if (!email) {
            return res.status(400).send("Email is required for update");
        }
        // Update the user's email
        yield firebaseAdmin_1.default.auth().updateUser(user_id, {
            email: email,
        });
        res.status(200).send("User email updated successfully");
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal server error");
    }
}));
authUserRouter.delete("/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        yield firebaseAdmin_1.default.auth().deleteUser(user_id);
        res.status(200).send("User deleted successfully");
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal server error");
    }
}));
exports.default = authUserRouter;
