import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'backend/worker.mjs',
    output: {
        exports: 'named',
        format: 'es',
        file: 'dist-worker/worker.mjs',
        sourcemap: true,
    },
    plugins: [commonjs(), nodeResolve({ browser: true }), terser()],
}