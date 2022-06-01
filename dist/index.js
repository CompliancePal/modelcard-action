"use strict";
exports.__esModule = true;
var fs = require("fs");
var yaml = require("js-yaml");
var core = require("@actions/core");
var MLPROJECT_PATH = './MLproject';
try {
    if (fs.existsSync(MLPROJECT_PATH)) {
        console.log('MLproject file found');
    }
    else {
        throw new Error('MLproject file missing!');
    }
    var mlproject = yaml.load(fs.readFileSync(MLPROJECT_PATH, 'utf8'));
    console.log('MLproject file opened');
    var modelcard_path = mlproject.modelcard;
    //Check that modelcard is defined in the MLproject file
    if (!modelcard_path) {
        throw new Error("'modelcard' property not found in MLproject file!");
    }
    try {
        var modelcard = yaml.load(fs.readFileSync(modelcard_path, 'utf8'));
        console.log('Model card file opened');
        // Do stuff with the model card file
    }
    catch (e) {
        throw new Error('Could not open model card file!');
    }
}
catch (error) {
    if (error instanceof Error)
        core.setFailed(error.message);
}
