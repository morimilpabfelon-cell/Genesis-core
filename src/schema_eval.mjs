import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = process.cwd();
const casesFile = path.join(root, "evals", "schema_cases.jsonl");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function loadCases() {
  return fs.readFileSync(casesFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function caseData(testCase) {
  if (testCase.data_ref) return readJson(testCase.data_ref);
  return testCase.data;
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
const compiled = new Map();

function validatorFor(schemaRel) {
  if (!compiled.has(schemaRel)) {
    const schema = readJson(schemaRel);
    compiled.set(schemaRel, ajv.compile(schema));
  }
  return compiled.get(schemaRel);
}

const results = loadCases().map((testCase) => {
  const validate = validatorFor(testCase.schema);
  const actual = Boolean(validate(caseData(testCase)));
  return {
    id: testCase.id,
    schema: testCase.schema,
    expected: testCase.expected_valid,
    actual,
    errors: actual === testCase.expected_valid ? [] : validate.errors || []
  };
});

const failures = results.filter((result) => result.actual !== result.expected);
console.log(JSON.stringify({ suite: "JSON_SCHEMA_VALIDATION", total: results.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("JSON Schema evals passed");
