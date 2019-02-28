import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [babel({
            exclude: 'node_modules/**',
            presets: [['@babel/preset-env', { modules: false, targets: { node: "8" } }]] }
        )],
    output: [{
        dir: 'dist',
        format: 'cjs'
    }]
};
