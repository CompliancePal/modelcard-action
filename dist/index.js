"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const core = __importStar(require("@actions/core"));
const validator_1 = require("./validator");
const MLPROJECT_PATH = './MLproject';
const main = async () => {
    try {
        if (fs.existsSync(MLPROJECT_PATH)) {
            console.log('MLproject file found');
        }
        else {
            throw new Error('MLproject file missing!');
        }
        const mlproject = yaml.load(fs.readFileSync(MLPROJECT_PATH, 'utf8'));
        console.log('MLproject file opened');
        const modelcard_path = mlproject.modelcard;
        //Check that modelcard is defined in the MLproject file
        if (!modelcard_path) {
            throw new Error("'modelcard' property not found in MLproject file!");
        }
        try {
            const raw = fs.readFileSync(modelcard_path, 'utf8');
            console.log('Model card file opened');
            // Do stuff with the model card file
            // Find problems
            const diagnostics = await (0, validator_1.validator)(raw);
            // TODO: iterate over diagnostics
            diagnostics.forEach((problem) => {
                console.log(problem);
            });
        }
        catch (e) {
            throw new Error('Could not open model card file!');
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
};
main();
