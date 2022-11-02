// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

var core = require("@actions/core");
var config = require("fs").readFileSync(
  "token_values/references.json",
  "utf-8"
);
var obj = JSON.parse(config);

core.setOutput("data", JSON.stringify(obj));
