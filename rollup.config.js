import path from 'path';
import resolve from '@rollup/plugin-node-resolve'; // 帮助寻找node_modules里的包
import commonjs from '@rollup/plugin-commonjs'; // 将非ES6语法的包转为ES6可用
import babel from 'rollup-plugin-babel'; // rollup 的 babel 插件，ES6转ES5
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify'; // 压缩包
const license = require('rollup-plugin-license');
import banner2 from 'rollup-plugin-banner2';

// 处理node的内置模块,发布node的第三方{builtins, globals}
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';

import pkg from './package.json';

const config = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: pkg.name.substr(0, 1).toUpperCase() + pkg.name.substr(1), // 浏览器引用时插件名称
      file: pkg.browser,
      format: 'iife',
      plugins: [terser()],
      // sourcemap: true  //生成bundle.map.js文件，方便调试
    },
    plugins: [
      resolve(), // 这样 Rollup 能找到 `ms`
      commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
      // eslint({
      // 	throwOnError: true,
      // 	throwOnWarning: true,
      // 	include: ['src/**'],
      // 	exclude: ['node_modules/**']
      // }),
      babel({
        exclude: 'node_modules/**', // 防止打包node_modules下的文件
        runtimeHelpers: true, // 使plugin-transform-runtime生效
      }),
      terser(),
      uglify(),
      banner2(
        () => `
/**
 * @description: 翻牌类游戏
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-01-15 11:58:49
 * @LastEditTime: 2022-01-14 11:01:12
 * @FilePath: \business-logic\template\js\index.js
 * @warning:
 */
    `
      ),
      // license({
      //   sourcemap: true,
      //   cwd: '.', // Default is process.cwd()

      //   banner: {
      //     commentStyle: 'regular', // The default

      //     content: {
      //       file: path.join(__dirname, 'LICENSE'),
      //       encoding: 'utf-8', // Default is utf-8
      //     },
      //   },

      //   // thirdParty: {
      //   //   includePrivate: true, // Default is false.
      //   //   output: {
      //   //     file: path.join(__dirname, 'dist', 'dependencies.txt'),
      //   //     encoding: 'utf-8', // Default is utf-8.
      //   //   },
      //   // },
      // }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    external: [],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      resolve(), // 这样 Rollup 能找到 `ms`
      commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
      // babel({
      // 	exclude: 'node_modules/**', // 防止打包node_modules下的文件
      // 	runtimeHelpers: true, // 使plugin-transform-runtime生效
      // }),
      terser(),
    ],
  },
];

export default config;
