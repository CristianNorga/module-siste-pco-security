import {
  // jwtVerify,
  importJWK,
  CompactEncrypt,
  compactDecrypt,
  compactVerify,
} from 'jose'
import { useRuntimeConfig } from '#imports'

export async function defineCrypto() {
  const { responseEncrypt } = useRuntimeConfig().security

  const ENCRYPTION_KEY = { kty: 'oct', k: responseEncrypt.key } // JWK para JWE
  const SIGNING_KEY = { kty: 'oct', k: '...' } // JWK para JWS

  async function decryptJWE(jwe: string) {
    const key = await importJWK(ENCRYPTION_KEY, 'A256GCM')
    const { plaintext } = await compactDecrypt(jwe, key)
    return new TextDecoder().decode(plaintext)
  }

  async function verifyJWS(jws: string) {
    const key = await importJWK(SIGNING_KEY, 'HS256')
    return await compactVerify(jws, key)
  }

  async function validateJWT(jwtPayload: string) {
    const payload = JSON.parse(jwtPayload)
    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      throw new Error('Token expirado')
    }
    return payload
  }

  async function encryptJWE(data: object): Promise<string> {
    try {
      const json = JSON.stringify(data)
      const key = await importJWK(ENCRYPTION_KEY, 'A256GCM')
      const encoder = new TextEncoder()
      const encrypted = await new CompactEncrypt(encoder.encode(json))
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(key)
      return encrypted
    }
    catch (error) {
      console.error('Error encrypting data:', error)
      return 'null'
    }
  }

  return {
    encryptJWE,
    decryptJWE,
    verifyJWS,
    validateJWT,
  }
}
