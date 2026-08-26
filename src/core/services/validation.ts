import Ajv from "ajv";
import addFormats from "ajv-formats";
import { curriculumPackageSchema } from "../../contracts/package-schema";
import { CurriculumPackage } from "../../contracts/curriculum";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validatePackage = ajv.compile(curriculumPackageSchema);

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePackageAgainstSchema(pkg: any): SchemaValidationResult {
  const valid = validatePackage(pkg);
  if (valid) {
    return { isValid: true, errors: [] };
  }

  const errors = (validatePackage.errors || []).map(
    (err) => `${err.instancePath || "root"}: ${err.message}`
  );

  return { isValid: false, errors };
}
