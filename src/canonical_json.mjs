import crypto from "node:crypto";

export function canonicalize(value) {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Non-finite numbers are not canonical JSON");
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  throw new Error(`Unsupported canonical JSON value: ${typeof value}`);
}

export function omitFields(value, fields = []) {
  const blocked = new Set(fields);
  if (Array.isArray(value)) return value.map((item) => omitFields(item, fields));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !blocked.has(key))
        .map(([key, nested]) => [key, omitFields(nested, fields)])
    );
  }
  return value;
}

export function canonicalHash(value, excludeFields = []) {
  const clean = omitFields(value, excludeFields);
  const canonical = canonicalize(clean);
  const digest = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
  return `sha256:${digest}`;
}
