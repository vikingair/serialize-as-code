[![GitHub license][license-image]][license-url]
[![npm package][npm-image]][npm-url] 
[![Travis][build-image]][build-url]
[![Coverage Status][coveralls-image]][coveralls-url]

# serialize-as-code

This serializer is intended for serializing ANY Javascript objects into
its source code representation. It is cyclomatic-save extension and alternative
to e.g. `JSON.stringify`. It can even be used to perform deep comparisions
for most cases. ATTENTION: There is no functionality to parse the string back
to the provided object. (one-direction-flow)

### Some aspects
- `TypeScript` support included
- ~ 1 kB (gzipped) (see [bundlephobia](https://bundlephobia.com/result?p=serialize-as-code))

### Installation
##### With yarn
```
yarn add serialize-as-code # if you want to use it for prod
yarn add --dev serialize-as-code # if only used in tests
```

### Usage
You may import the named import `Serializer` and call run with ANY object.
It prints the object as its source code. So you should be able to copy-paste
the printed result and most deep comparisons should work.
```js
import { Serializer } from 'serialize-as-code';

// Arrays or Objects
console.log(Serializer.run({foo: 'bar'})); // prints: {foo: 'bar'}
console.log(Serializer.run([1, 2])); // prints: [1, 2]

// Symbols (not suppoerted on JSON.stringify)
console.log(Serializer.run(Symbol.for('my-key')));
// prints: Symbol.for('my-key')

// JSX (but react is not needed and their is no dependency)
console.log(Serializer.run(<Fragment key="foo"><div>Test that</div></Fragment>));
// prints: <Fragment key="foo"><div>Test that</div></Fragment>
```
If you try to serialize cyclomatic structures, you will see within the result
were they were detected.

### Custom serialization
You have the possibility to apply ANY custom serialization just on top.
```js
import { Serializer } from 'serialize-as-code';

const someObjectToMatch = { foo: 'foo' };

const CustomSerializer = (o: any): string | void => {
    if (o === someObjectToMatch) return 'FOO';
    // return undefined to proceed with regular serialization
};

const YourSerializer = Serializer.create(CustomSerializer);

console.log({ canBe: 'nested', here: someObjectToMatch });
// prints: {canBe: 'nested', here: FOO}
```

  
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/fdc-viktor-luft/form4react/blob/master/LICENSE
[build-image]: https://img.shields.io/travis/fdc-viktor-luft/serialize-as-code/master.svg?style=flat-square
[build-url]: https://travis-ci.org/fdc-viktor-luft/serialize-as-code
[npm-image]: https://img.shields.io/npm/v/serialize-as-code.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/serialize-as-code
[coveralls-image]: https://coveralls.io/repos/github/fdc-viktor-luft/serialize-as-code/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/fdc-viktor-luft/serialize-as-code?branch=master
