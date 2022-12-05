"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var report_1 = require("./report");
var output = (0, report_1.report)("../token_values/product", "token_slots.json");
var data = JSON.stringify(output, null, 2);
console.log(data);
fs_1["default"].writeFileSync("report.json", data);
