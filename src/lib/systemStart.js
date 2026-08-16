// Tiny one-shot coordination bus: the initial loader signals "system ready"
// once it starts fading out, and the Hero intro timeline waits for that
// signal so the load sequence hands off seamlessly into the reveal.
// One-shot and idempotent — repeat signals are ignored.

let ready = false
const waiting = new Set()

export function signalSystemReady() {
  if (ready) return
  ready = true
  waiting.forEach((fn) => fn())
  waiting.clear()
}

export function onSystemReady(fn) {
  if (ready) {
    fn()
    return () => {}
  }
  waiting.add(fn)
  return () => waiting.delete(fn)
}

export function isSystemReady() {
  return ready
}