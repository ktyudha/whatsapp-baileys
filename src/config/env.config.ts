import { parseEnv } from "./parse-env.config";

export default parseEnv(Object.assign(process.env));
