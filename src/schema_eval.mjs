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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function pathParts(dottedPath) {
  return dottedPath.split(".").filter(Boolean);
}

function deletePath(target, dottedPath) {
  const parts = pathParts(dottedPath);
  const last = parts.pop();
  let cursor = target;
  for (const part of parts) {
    if (!cursor || typeof cursor !== "object") return;
    cursor = cursor[part];
  }
  if (cursor && typeof cursor === "object") delete cursor[last];
}

function setPath(target, dottedPath, value) {
  const parts = pathParts(dottedPath);
  const last = parts.pop();
  let cursor = target;
  for (const part of parts) {
    if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
    cursor = cursor[part];
  }
  cursor[last] = value;
}

function caseData(testCase) {
  const data = clone(testCase.data_ref ? readJson(testCase.data_ref) : testCase.data);
  for (const dottedPath of testCase.remove || []) deletePath(data, dottedPath);
  for (const [dottedPath, value] of Object.entries(testCase.set || {})) setPath(data, dottedPath, value);
  return data;
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
