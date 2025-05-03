// import { encryptJWE } from '../utils/crypto'
// import { defineNitroPlugin } from '#imports'
import type { NitroApp } from 'nitropack'
import { defineCrypto } from '../utils/crypto'

type NitroAppPlugin = (nitro: NitroApp) => void

function defineNitroPlugin(def: NitroAppPlugin): NitroAppPlugin {
  return def
}
export default defineNitroPlugin(async (nitro) => {
  console.log('nitro plugin encryptReponse loaded')
  const { encryptJWE } = await defineCrypto()

  nitro.hooks.hook('beforeResponse', async (event, { body }) => {
    const encrypted = await encryptJWE(body as object)
    event.respondWith(new Response(encrypted))
  })
})
