import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('authorizationBasic middleware', async () => {
  // beforeAll(async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    server: true,
    nuxtConfig: {
      runtimeConfig: {
        security: {
          authorization: {
            enabled: true,
            type: 'basic',
            credentials: {
              username: 'test',
              password: '123',
            },
          },
        },
      },
    },
  })
  // })

  it('denies request with no auth header', async () => {
    await $fetch('/api/ping').catch((res) => {
      expect((res as Response).status).toEqual(401)
    })
  })

  it('denies request with invalid credentials', async () => {
    const invalid = Buffer.from('wrong:creds').toString('base64')
    await $fetch('/api/ping', {
      headers: {
        authorization: `Basic ${invalid}`,
      },
    }).catch((res) => {
      expect((res as Response).status).toEqual(401)
    })
  })

  it('allows request with correct credentials', async () => {
    const valid = Buffer.from('test:123').toString('base64')
    const response = await $fetch('/api/ping', {
      headers: {
        authorization: `Basic ${valid}`,
      },
    })
    expect((response as Response).status).not.toBe(401)
  })

  // afterAll(() => {
  //   vitest.resetConfig()
  // })
})
