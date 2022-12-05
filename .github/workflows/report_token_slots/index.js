// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
// ncc build index.js --license licenses.txt

import { report } from "../../../token_slots/src/report";
const core = require("@actions/core");

const output = report("token_values/product", "token_slots/token_slots.json");
delete output["FIGMA TOKENS"];
delete output["TOKEN SLOTS"];

let data = JSON.stringify(output, null, 2);
core.setOutput("report", output);
