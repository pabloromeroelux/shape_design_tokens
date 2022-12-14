// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
// ncc build index.js --license licenses.txt

const core = require("@actions/core");
const fs = require("fs");
var jsonFormat = require("json-format");

const prefix = "";
const referencePaths = [
  `${prefix}token_values/mobile/reference.json`,
  `${prefix}token_values/product/reference.json`,
  `${prefix}token_values/web/reference.json`,
  `${prefix}token_values/web/template.json`,
];

const updatedPaths = Array(core.getInput("changes"));
const path = updatedPaths[0];

var jsonConfig = {
  type: "space",
  size: 2,
};

if (path) {
  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  referencePaths.forEach((f) => {
    fs.unlinkSync(f);
    fs.writeFileSync(f, jsonFormat(data, jsonConfig));
  });
  core.setOutput("data", data);
} else {
  core.setOutput("data", {});
}

core.setOutput("updates", core.getInput("changes"));
