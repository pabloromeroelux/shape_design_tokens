import path from "path";
import fs from "fs";
import axios from "axios";

const filePaths: string[] = [];

const flattenJSON = (obj: any = {}, res: any = {}, extraKey = "") => {
  for (const key in obj) {
    if (typeof obj[key] !== "object" || key === "value") {
      // if the key name is value means it is the end
      // if the key is not an object it means is the end

      // if it is obj then flatten the obj
      if (key === "value" && typeof obj[key] === "object") {
        res[extraKey.slice(0, -1)] = JSON.stringify(obj[key]);
      } else {
        // if it is not obj then just set it
        if (key === "value") {
          res[extraKey.slice(0, -1)] = obj[key];
        }
      }
    } else {
      flattenJSON(obj[key], res, `${extraKey}${key}.`);
    }
  }
  return res;
};

const getAllStrings = (obj: any = {}, res: string[] = []) => {
  const arr = res;
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      arr.push(obj[key]);
    } else {
      getAllStrings(obj[key], res);
    }
  }
  return res;
};

function getPaths(startPath: string) {
  const filter = ".json";

  if (!fs.existsSync(startPath)) {
    return;
  }

  const files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      getPaths(filename); //recurse
    } else if (filename.endsWith(filter) && !filename.includes("/$")) {
      filePaths.push(filename);
    }
  }
}

getPaths("../token_values/product");
const flatFiles = filePaths.map((path) => {
  let rawdata = fs.readFileSync(path);
  let content = JSON.parse(rawdata.toString());
  return flattenJSON(content);
});

const singleFile = Object.assign({}, ...flatFiles);

const figmaTokensSlots: string[] = [];
Object.keys(singleFile).forEach((key) => {
  // console.log(key);
  const tokenParts = key.split(".");
  tokenParts.forEach((part) => {
    if (!figmaTokensSlots.includes(part)) {
      figmaTokensSlots.push(part);
    }
  });
});

let tokenSlotsFile = getAllStrings(
  JSON.parse(fs.readFileSync("token_slots.json").toString())
);

const notDocumented: string[] = [];
figmaTokensSlots.forEach((slot) => {
  if (!tokenSlotsFile.includes(slot)) {
    notDocumented.push(slot);
  }
});

const notUsed: string[] = [];
tokenSlotsFile.forEach((slot) => {
  if (!figmaTokensSlots.includes(slot)) {
    notUsed.push(slot);
  }
});

const output = {
  "FIGMA TOKENS": figmaTokensSlots.sort(),
  "TOKEN SLOTS": tokenSlotsFile.sort(),
  "NOT DOCUMENTED": notDocumented.sort(),
  "NOT USED": notUsed.sort(),
};

let data = JSON.stringify(output, null, 2);

fs.writeFileSync("report.json", data);
