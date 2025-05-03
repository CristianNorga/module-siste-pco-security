import { defineNuxtModule, createResolver, addServerPlugin, addServerHandler, addTemplate } from '@nuxt/kit'
import defu from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  aes: {
    keyShared: string
  } | null
  rsa: {
    keyPublic: string
    keyPrivate: string
  } | null
  responseEncrypt: {
    enabled: boolean
    key: string
  } | null
  authorization: {
    enabled: boolean
    type: 'basic' | 'bearer'
  } | null
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@cristiannorga/security',
    configKey: 'security',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    aes: null,
    rsa: null,
    responseEncrypt: null,
    authorization: null,
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    const config = _nuxt.options.runtimeConfig as unknown as {
      security: ModuleOptions
      public: Record<string, unknown>
    }

    config.security = defu(config.security || {}, {
      aes: _options.aes,
      rsa: _options.rsa,
      responseEncrypt: _options.responseEncrypt,
      authorization: _options.authorization,
    })

    if (config.security.authorization?.enabled) {
      addServerHandler(
        {
          handler: resolver.resolve('./runtime/server/middleware/authorizationBasic.ts'),
          middleware: true,
        },
      )
    }

    if (config.security.responseEncrypt?.enabled) {
      addTemplate({
        filename: 'types/index.ts',
        getContents: () => [
          'declare module \'siste-security\' {',
          `  const defineCrypto: typeof import('${resolver.resolve('./runtime/server/utils/crypto')}').defineCrypto`,
          '}',
        ].join('\n'),
      })
      addServerPlugin(resolver.resolve('./runtime/server/plugins/encryptReponse.ts'))
    }
  },
})
