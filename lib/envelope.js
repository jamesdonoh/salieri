const isObject = (val) => typeof val === 'object' && val !== null;
const isString = (val) => typeof val === 'string';

const hasAllKeys = (env) => 'head' in env && 'bodyInline' in env && 'bodyLast' in env;

const hasValidKeyTypes = (env) =>
    Array.isArray(env.head) && Array.isArray(env.bodyLast) && isString(env.bodyInline);

const isValid = (val, strictTypes = false) =>
    isObject(val) && hasAllKeys(val) && (!strictTypes || hasValidKeyTypes(val));

const join = (arr) => arr.join('\n');
const flattenAndJoin = (arr) => join(arr.reduce((a, b) => a.concat(b), []));

const combine = (envelopes) => ({
    head: flattenAndJoin(envelopes.map((env) => env.head)),
    bodyInline: join(envelopes.map((env) => env.bodyInline)),
    bodyLast: flattenAndJoin(envelopes.map((env) => env.bodyLast)),
});

module.exports = {
    isValid,
    combine
};
