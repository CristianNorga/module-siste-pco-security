import { importJWK, compactDecrypt } from 'jose'
import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { jwe } = await readBody(event)
  const { responseEncrypt } = useRuntimeConfig().security
  const ENCRYPTION_KEY = { kty: 'oct', k: responseEncrypt.key }
  const key = await importJWK(ENCRYPTION_KEY, 'A256GCM')
  const { plaintext } = await compactDecrypt(jwe, key)
  return new TextDecoder().decode(plaintext)
})
