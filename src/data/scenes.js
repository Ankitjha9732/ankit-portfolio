import { scrollToTarget } from '../lib/scroll'

// The six spatial scenes that make up the continuous experience.
// Used by the progress navigator and by inline jump controls.

export const scenes = [
  { id: 'identity', label: 'Identity', target: '#scene-identity' },
  { id: 'story', label: 'Story', target: '#scene-story' },
  { id: 'ecosystem', label: 'Ecosystem', target: '#scene-ecosystem' },
  { id: 'work', label: 'Work', target: '#scene-work' },
  { id: 'journey', label: 'Journey', target: '#scene-journey' },
  { id: 'connect', label: 'Connect', target: '#scene-connect' },
]

export function scrollToScene(id) {
  const scene = scenes.find((s) => s.id === id)
  if (!scene) return
  scrollToTarget(scene.target)
}