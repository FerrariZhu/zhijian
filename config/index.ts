import { defineConfig, type UserConfigExport } from '@tarojs/cli'

export default defineConfig<'webpack5'>(async (merge) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'zhijian',
    date: '2026-09-17',
    designWidth: 750,
    deviceRatio: {
      375: 2,
      750: 1
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV ?? 'h5'}`,
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: true
    },
    alias: {
      '@': require('path').resolve(__dirname, '..', 'src')
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, {
      mini: {},
      h5: {
        devServer: {
          port: 10086
        }
      }
    })
  }

  return merge({}, baseConfig, {
    mini: {},
    h5: {}
  })
})
