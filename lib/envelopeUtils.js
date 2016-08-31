const isObject = (val) => typeof val === 'object' && val !== null;
const isString = (val) => typeof val === 'string';

const hasValidKeyTypes = (env) =>
    Array.isArray(env.head) && Array.isArray(env.bodyLast) && isString(env.bodyInline);

exports.isValid = (val) => isObject(val) && hasValidKeyTypes(val);
