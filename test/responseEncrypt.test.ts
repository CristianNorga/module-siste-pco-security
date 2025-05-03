import { importJWK, compactDecrypt } from 'jose'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll, vitest } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
// import { defineCrypto } from '../src/runtime/server/utils/crypto'

describe('responseEncrypt hook', async () => {
  // const { decryptJWE } = await defineCrypto()
  const keyEncryp = 'lEVlTfTFNy43IUaih3cJqCyKLuJwM1rekj-goDVU_f0'

  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/responseEncrypt', import.meta.url)),
    server: true,
    nuxtConfig: {
      runtimeConfig: {
        security: {
          responseEncrypt: {
            enabled: true,
            key: keyEncryp,
          },
        },
      },
    },
  })

  it('returns encrypted response body', async () => {
    await $fetch('/api/ping', { responseType: 'text' }).then(async (res: unknown) => {
      expect(typeof res).toBe('string')
      expect((res as string).length).toBeGreaterThan(10)
      // Podrías intentar descifrar aquí si conoces la clave, o simplemente validar que no es JSON plano
      const ENCRYPTION_KEY = { kty: 'oct', k: keyEncryp }
      const key = await importJWK(ENCRYPTION_KEY, 'A256GCM')
      const { plaintext } = await compactDecrypt(res as string, key)
      const decrypted = new TextDecoder().decode(plaintext)

      expect(decrypted).toEqual('{"message":"pong"}')
      // const decrypted = decryptJWE(res as string)
      expect(decrypted).toBeDefined()
      expect(decrypted).toBe('{"message":"pong"}')
    })
  })

  // afterAll(() => {
  //   vitest.resetConfig()
  // })
})
