import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

const extensions = ['.ts', '.tsx'];

export default {
    input: 'src/index.ts',
    plugins: [
        resolve({ extensions }),
        babel({
            extensions,
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
    ],
    output: [
        { dir: 'dist/cjs', format: 'cjs' },
        { dir: 'dist/esm', format: 'esm' },
    ]
};
