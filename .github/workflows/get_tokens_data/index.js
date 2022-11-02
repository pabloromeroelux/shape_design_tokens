// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

var core = require("@actions/core");
var axios = require("axios");
axios.get("../../../token_values/reference.json").then(function (dara) {
  core.setOutput("data", JSON.stringify(data));
});
