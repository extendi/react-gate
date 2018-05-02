import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';
import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/react-gate/index.js',
  output: [{
    file: './lib/react-gate.js',
    format: 'cjs',
  },
  {
    file: './lib/react-gate.es6.js',
    format: 'es',
  },
  {
    name: 'ReactGate',
    file: './lib/react-gate.umd.js',
    format: 'umd',
  },
  ],
  external: ['prop-types', 'redux', 'react', 'react-redux', 'react-router-dom', 'react-dom'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    flow(),
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }], 'react', 'stage-0', 'flow'],
      plugins: [
        ['transform-object-rest-spread'],
        ['transform-function-bind'],
        ['transform-class-properties'],
        ['external-helpers'],
        ['module-resolver', {
          root: ['./src'],
        }],
      ],
    }),
    resolve({
      extensions: ['.jsx', '.js'],
    }),
    sourceMaps(),
    uglify(),
    filesize(),
  ],
};
