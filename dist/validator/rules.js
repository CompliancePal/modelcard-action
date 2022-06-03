"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spectral_functions_1 = require("@stoplight/spectral-functions");
const rules = {
    // TODO: The rules should be fixed. (This a dummy set)
    rules: {
        'no-empty-description': {
            given: '$.description',
            message: 'Description must not be empty',
            then: {
                function: spectral_functions_1.truthy,
            },
        },
    },
};
exports.default = rules;
