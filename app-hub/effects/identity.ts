import {
  Id,
  IO,
  Reader,
  type DomEnv,
  sessionGet,
  sessionSet,
  runDomIO,
  browserEnv
} from 'algebraic-js'

/**
 * Pure identity generator for this device.
 * Uses Id ADT to hold the logical value, Reader/IO to persist it.
 */
export const getPlayerId = Reader<DomEnv, IO<Id<string>>>((env) =>
  IO(() => {
    const key = 'playerId'
    const stored = runDomIO(sessionGet(key), browserEnv())
    const idValue = stored ?? crypto.randomUUID()
    if (!stored) runDomIO(sessionSet(key, idValue), browserEnv())
    return Id(idValue)
  })
)
