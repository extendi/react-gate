import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';
import { minify } from 'uglify-es';

const externals = ['prop-types', 'redux', 'react', 'react-redux', 'react-router-dom', 'react-dom'];
const globals = {
  'prop-types': 'PropTypes',
  redux: 'Redux',
  'react-redux': 'ReactRedux',
  'react-router-dom': 'ReactRouterDom',
  'react-dom': 'ReactDom',
};

const babelConf = {
  babelrc: false,
  presets: [['env', { modules: false }], 'stage-0', 'react'],
  plugins: [
    ['transform-object-rest-spread'],
    ['transform-function-bind'],
    ['transform-class-properties'],
    ['external-helpers'],
    ['module-resolver', {
      root: ['./src'],
    }],
  ],
};

export default [
  {
    input: 'src/react-gate/index.js',
    output: {
      file: './lib/react-gate.es6.js',
      format: 'es',
    },
    external: externals,
    plugins: [flow(), resolve({ extensions: ['.js', '.jsx'] }), commonjs(), babel(babelConf), filesize()],
  },
  {
    input: 'src/react-gate/index.js',
    output: {
      file: './lib/index.js',
      format: 'umd',
      globals,
      name: 'ReactGate',
    },
    external: externals,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      }),
      flow(),
      resolve({ extensions: ['.js', '.jsx'] }),
      commonjs(),
      babel(babelConf),
      uglify({}, minify),
      filesize(),
    ],
  },
];
