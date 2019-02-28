/**
 * This file is part of serialize-as-code which is released under MIT license.
 *
 * The LICENSE file can be found in the root directory of this project.
 *
 * @flow
 */

type optString = string | void;
type CustomSerializer = any => optString;
type _OSerializer = (any, CustomSerializer | void, Array<any>) => optString;
type _Serializer = (any, CustomSerializer | void, Array<any>) => string;
const NOP = () => {};

const forEach = (o: Object, handler: (v: any, k: string) => any): void =>
    Object.keys(o).forEach(k => handler(o[k], k));

const __typePattern = /^\[object ([^\]]+)]$/;
const __getTypeOfObject = (o: any): optString =>
    (__typePattern.exec(Object.prototype.toString.call(o)) || [undefined])[1];

const __serializeProp = (
    key: string | number,
    value: any,
    custom?: CustomSerializer,
    serialized: Array<any>
): string =>
    typeof value === 'string'
        ? `${key}="${value}"`
        : `${key}={${__serialize(value, custom, serialized)}}`;

const __serializeProps: _Serializer = (o, custom, serialized) => {
    const elemProps = o.props;
    const props = [];
    forEach(elemProps, (v, k) => {
        if (v !== undefined && k !== 'children')
            props.push(__serializeProp(k, v, custom, serialized));
    });
    if (o.key) props.push(__serializeProp('key', o.key, custom, serialized));
    if (o.ref) props.push(__serializeProp('ref', o.ref, custom, serialized));
    if (!props.length) return '';
    return ' ' + props.join(' ');
};

const __serializeChildren: _Serializer = (o, custom?, serialized) => {
    const children = o.props.children;
    if (!children) return '';
    if (typeof children === 'string') return children;
    return Array.isArray(children)
        ? children.map(v => __serialize(v, custom, serialized)).join('')
        : __serialize(children, custom, serialized);
};

const __reactTypeNameReader: { [optString]: (type: any) => optString } = {
    String: type => type,
    Function: type => type.name,
    Symbol: type =>
        (Symbol.keyFor(type) === 'react.fragment' && 'Fragment') || undefined,
};

const getTypeName = (type: any): optString =>
    (__reactTypeNameReader[__getTypeOfObject(type)] || NOP)(type);

const __serializeReactElement: _Serializer = (o, custom, serialized) => {
    const type = getTypeName(o.type) || 'UNKNOWN';
    // the following line would serialize custom react components deep instead of shallow (but its out-commented
    // because usually it is more helpful to see what was provided)
    // if (typeof o.type === 'function') return __serialize(new o.type(o.props).render(), custom, serialized);
    const children = __serializeChildren(o, custom, serialized);
    return `<${type}${__serializeProps(o, custom, serialized)}${
        children ? `>${children}</${type}>` : ' />'
    }`;
};

const __serializeReact: _OSerializer = (o, custom, serialized) => {
    const symbolKey = Symbol.keyFor(o.$$typeof);
    switch (symbolKey) {
        case 'react.element':
            return __serializeReactElement(o, custom, serialized);
        default:
            return;
    }
};

const __serializeIfReact: _OSerializer = (o, custom, serialized) => {
    if (Object.prototype.toString.call(o.$$typeof) === '[object Symbol]') {
        const key = Symbol.keyFor(o.$$typeof);
        if (key && key.indexOf('react.') === 0)
            return __serializeReact(o, custom, serialized);
    }
};

const __serializerByType: { [optString]: (o: any) => string } = {
    RegExp: o => `/${String(o)}/`,
    String: o =>
        o.indexOf('"') === -1 && o.indexOf("'") !== -1 ? `"${o}"` : `'${o}'`,
    Function: o => o.name || 'Function',
    Date: o => `new Date(${Number(o)})`,
    Number: o => String(o),
    Boolean: o => String(o),
    Symbol: o =>
        Symbol.keyFor(o) === undefined
            ? o.toString() // unique symbol, therefore toString is the best choice
            : `Symbol.for('${(Symbol.keyFor(o): any)}')`,
    Error: o => `new ${o.name}('${o.message}')`,
};

const __serializeArray: _OSerializer = (o, custom, serialized) => {
    if (Array.isArray(o)) {
        const results = [];
        for (let i = 0; i < o.length; i++) {
            results.push(__serialize(o[i], custom, serialized));
        }
        return `[${results.join(', ')}]`;
    }
};

const __serializeObject: _Serializer = (o, custom, serialized) => {
    const oKeys = Object.keys(o);
    const results = [];
    for (let i = 0; i < oKeys.length; i++) {
        const key = oKeys[i];
        results.push(`${key}: ${__serialize(o[key], custom, serialized)}`);
    }
    const objectType = o.constructor.name;
    const displayedType = objectType === 'Object' ? '' : objectType;
    return `${displayedType}{${results.join(', ')}}`;
};

const Serialize: { [*]: _OSerializer } = {
    custom: (o, custom) => custom && custom(o),
    undefOrNull: o =>
        (o === undefined && 'undefined') || (o === null && 'null') || undefined,
    flat: o => (__serializerByType[__getTypeOfObject(o)] || NOP)(o),
    cyclomatic: (o, _, serialized) =>
        (serialized.indexOf(o) !== -1 && '>CYCLOMATIC<') || undefined,
    react: __serializeIfReact,
    array: __serializeArray,
};

const __serialize: _Serializer = (o, custom, serialized) =>
    Serialize.custom(o, custom, serialized) ||
    Serialize.undefOrNull(o, custom, serialized) ||
    Serialize.flat(o, custom, serialized) ||
    Serialize.cyclomatic(o, custom, serialized) ||
    (nextSerialized =>
        Serialize.react(o, custom, nextSerialized) ||
        Serialize.array(o, custom, nextSerialized) ||
        __serializeObject(o, custom, nextSerialized))([...serialized, o]);

const _serialize = (o: any, custom?: CustomSerializer): string =>
    __serialize(o, custom, []);

export const Serializer = {
    run: (o: any): string => _serialize(o),
    create: (custom: CustomSerializer) => (o: any): string =>
        _serialize(o, custom),
};
