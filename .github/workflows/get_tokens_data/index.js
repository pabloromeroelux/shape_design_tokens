// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
// ncc build index.js --license licenses.txt

const core = require("@actions/core");
const fs = require("fs");
const merge = require("deepmerge");
var jsonFormat = require("json-format");

function compare(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}

const prefix = "";

const paths = [
  `${prefix}token_values/mobile/reference.json`,
  `${prefix}token_values/product/reference.json`,
  `${prefix}token_values/web/reference.json`,
];

var jsonConfig = {
  type: "space",
  size: 2,
};

const updates = paths
  .map((path, i) => {
    const stats = fs.statSync(path);
    var mtime = stats.ctimeMs;
    return { path: paths[i], date: mtime };
  })
  .sort(compare);

core.setOutput("updates", JSON.stringify(updates));

const filesContent = updates.map((f) =>
  JSON.parse(fs.readFileSync(f.path, "utf-8"))
);

const output = merge.all(filesContent);

updates.forEach((f) => {
  fs.unlinkSync(f.path);
  fs.writeFileSync(f.path, jsonFormat(output, jsonConfig));
});

const config = fs.readFileSync(paths[0], "utf-8");

const obj = JSON.parse(config);
const data = { reference: obj };
core.setOutput("data", JSON.stringify(data));
