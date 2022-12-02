"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weeks = void 0;
var zod_1 = require("zod");
exports.Weeks = zod_1.z.object({
    monday: zod_1.z
        .string()
        .regex(new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]s?-s?([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]")),
});
//# sourceMappingURL=genu_script.js.map