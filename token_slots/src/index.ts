import fs from "fs";
import { report } from "./report";

const output = report("../token_values/product", "token_slots.json");
let data = JSON.stringify(output, null, 2);
console.log(data);
fs.writeFileSync("report.json", data);
