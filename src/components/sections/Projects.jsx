import { useRef, useState, useEffect, lazy } from 'react'
import gsap from 'gsap'
import { EASE } from '../../animations/gsapSetup'
import { useGraphicQuality, useReducedMotion } from '../../hooks/useResponsive'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import LazyScene from '../three/LazyScene'
import TextLink from '../shared/TextLink'
import { projects } from '../../data/projects'

const SyllabusScene = lazy(() => import('../three/SyllabusScene'))
const RestroScene = lazy(() => import('../three/RestroScene'))
const RepoReadyScene = lazy(() => import('../three/RepoReadyScene'))

/* Scene progress runs within the stay-visible sticky window of each case:
   the world reaches its final state by `SPLIT` (fraction) of the case
   travel, then holds — instead of dragging across the whole tall section. */
const SPLIT = 0.62

/**
 * FlowRail — the case flow as a fill-in line. Each step is a tick on the rail
 * that lights up as the reader advances through the section.
 */
function FlowRail({ steps, active = 0, reduced }) {
  const current = Math.max(0, Math.min(active, steps.length - 1))

  return (
    <div data-rise className="mt-12 border-t border-line pt-8">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[9px] uppercase tracking-meta text-white/40">Flow</p>
        <p className="font-mono text-[9px] tracking-meta text-violet-400/80">
          at {reduced ? steps[steps.length - 1].label : steps[current].label}
        </p>
      </div>

      <div className="relative">
        <span className="absolute left-0 top-3 bottom-3 w-px bg-white/10" />
        <ul className="space-y-0">
          {steps.map((s, i) => {
            const done = current >= i
            return (
              <li key={s.label} className="relative py-3">
                <span
                  className="absolute left-0 top-0 block w-px bg-violet-500 transition-opacity duration-500"
                  style={{ height: '100%', opacity: done ? 1 : 0 }}
                />
                <div className="flex items-baseline justify-between gap-6 pl-8">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[9px] tracking-meta text-white/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[13px] transition-colors duration-500 ${
                        done ? 'text-ink' : 'text-white/45'
                      }`}
                    >
                      {s.label}
                    </span>
                  </span>
                  <span
                    className="h-px w-4 shrink-0 bg-violet-500/80 transition-opacity duration-500"
                    style={{ opacity: done ? 1 : 0.2 }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/**
 * StatusChip — subtle live/in-development indicator.
 * LIVE: faint ping + violet dot. IN DEVELOPMENT: animated processing dot.
 * Both collapse to static reads under reduced motion.
 */
function StatusChip({ status }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-meta text-violet-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
        </span>
        Live
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-meta text-violet-400/90">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500/90" />
      In development
    </span>
  )
}

function CaseStudy({ project, index, stages, Scene, quality, reduced }) {
  const sectionRef = useRef(null)
  const progress = useScrollProgress(sectionRef, 1)
  const drive = useRef({ value: reduced ? 1 : 0 })
  const initialStage = reduced && stages ? stages[stages.length - 1].label : stages ? stages[0].label : ''
  const [stage, setStage] = useState(initialStage)
  const stageIndex = stages ? Math.max(0, stages.findIndex((s) => s.label === stage)) : 0
  const featured = Boolean(project.featured)
  const dev = project.status === 'dev'

  useEffect(() => {
    if (reduced) {
      drive.current.value = 1
      return
    }
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const raw = progress.current.value
        // Stacked layouts (mobile / portrait tablet: single column, canvas
        // scrolls with the page instead of sticking) drive the story from the
        // canvas's own visibility window — it completes exactly as the visual
        // leaves the viewport, so nothing fires after the canvas is gone. On
        // desktop the side-by-side sticky canvas keeps the original whole-case
        // pacing (SPLIT).
        const canvasEl = sectionRef.current
          ? sectionRef.current.querySelector('[data-case-canvas]')
          : null
        let paced
        const stacked = window.matchMedia('(max-width: 1023px)').matches
        if (stacked && canvasEl) {
          const rect = canvasEl.getBoundingClientRect()
          const vh = window.innerHeight || 1
          paced = Math.min(1, Math.max(0, 1 - rect.bottom / vh))
        } else {
          paced = Math.min(1, raw / SPLIT)
        }
        drive.current.value = paced
        if (!stages) return
        let label = stages[0].label
        stages.forEach((s) => {
          if (paced >= s.at) label = s.label
        })
        setStage(label)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [stages, progress, reduced])

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-rise]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={sectionRef} className="relative border-t border-line">
      <div className="container-port relative py-20 md:py-32">
        <div className="mb-12 flex items-start justify-between">
          <p className="font-mono text-[10px] uppercase tracking-meta text-violet-400">
            Case {String(index).padStart(2, '0')}
          </p>
          <StatusChip status={project.status} />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Sticky stage canvas */}
          <div
            data-case-canvas
            className={`relative order-1 ${featured ? 'h-[56vh]' : 'h-[52vh]'} lg:order-2 lg:col-span-7 lg:${
              featured ? 'h-[96vh]' : 'h-[92vh]'
            } lg:overflow-visible`}
          >
            <div
              className={`relative h-full w-full lg:sticky lg:top-[5vh] lg:${
                featured ? 'h-[90vh]' : 'h-[88vh]'
              }`}
            >
              <LazyScene Component={Scene} progressRef={drive} quality={quality} reducedMotion={reduced} />

              <div className="vignette-base pointer-events-none absolute inset-0" />

              {/* live stage readout */}
              {stages && (
                <div className="pointer-events-none absolute bottom-6 left-0 flex items-center gap-3">
                  <span className="block h-px w-8 bg-violet-500/70" />
                  <p className="font-mono text-[9px] uppercase tracking-meta text-white/55">
                    {stage}
                  </p>
                </div>
              )}

              {dev && (
                <div className="pointer-events-none absolute right-0 top-2 font-mono text-[9px] uppercase tracking-meta text-white/30">
                  under construction
                </div>
              )}
            </div>
          </div>

          {/* case copy */}
          <div className="order-2 lg:order-1 lg:col-span-5 lg:pr-8">
            <span
              className={`block select-none font-display text-[clamp(3.2rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.04em] ${
                featured ? 'text-violet-500/10' : 'text-white/[0.06]'
              }`}
            >
              {String(index).padStart(2, '0')}
            </span>

            <h3 className="mt-6 font-display text-4xl font-semibold tracking-[-0.02em] text-ink md:text-6xl">
              {project.name}
              {featured && (
                <span className="ml-4 align-middle font-mono text-[9px] uppercase tracking-meta text-violet-400/80">
                  Primary
                </span>
              )}
            </h3>

            <p data-rise className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
              {project.short || project.description}
            </p>

            {project.longDescription && (
              <>
                <div data-rise className="mt-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-white/20" />
                  <p className="font-mono text-[9px] uppercase tracking-meta text-white/40">
                    The problem it solves
                  </p>
                </div>
                <p data-rise className="mt-4 max-w-md text-[14px] leading-relaxed text-white/60">
                  {project.longDescription}
                </p>
              </>
            )}

            {project.tech && project.tech.length > 0 && (
              <div data-rise className="mt-9">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-meta text-white/40">
                  Stack
                </p>
                <p className="font-mono text-[11px] uppercase tracking-label leading-loose text-ink/85">
                  {project.tech.join(' · ')}
                </p>
              </div>
            )}

            {dev ? (
              <div data-rise className="mt-10 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2.5 border border-dashed border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-meta text-white/55">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500/90" />
                  In development — no live demo yet
                </span>
              </div>
            ) : (
              <div data-rise className="mt-10 flex flex-wrap items-center gap-8">
                {project.live && (
                  <TextLink href={project.live} target="_blank" rel="noopener noreferrer" arrow>
                    View live
                  </TextLink>
                )}
                {project.github && (
                  <TextLink href={project.github} target="_blank" rel="noopener noreferrer" arrow>
                    View source
                  </TextLink>
                )}
              </div>
            )}

            {stages && (
              <FlowRail steps={stages} active={stageIndex} reduced={reduced} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CaseGap — editorial transition zone between one case world and the next.
 */
function CaseGap({ to, label }) {
  return (
    <div className="border-t border-line">
      <div className="container-port flex items-center gap-5 py-9">
        <span className="font-mono text-[9px] uppercase tracking-meta text-white/30">env</span>
        <span className="h-px w-10 bg-white/15" />
        <span className="font-mono text-[9px] uppercase tracking-meta text-violet-400/70">
          → {label}
        </span>
        <span className="hidden h-px max-w-[280px] flex-1 bg-white/10 sm:block" />
        <span className="font-mono text-[9px] uppercase tracking-meta text-white/30">{to}</span>
      </div>
    </div>
  )
}

/**
 * Scene 04 — WORK.
 * Exactly three projects, in order: Syllabus Tracker, RestroOrder, RepoReady.
 * Each becomes its own procedural world — a learning path, a restaurant line,
 * a repository being understood — with genuine description, features, stack
 * and links around it. RepoReady carries no live path; it reports its status.
 */
export default function Projects() {
  const quality = useGraphicQuality()
  const reduced = useReducedMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-rise]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="scene-work" ref={ref} aria-label="Work" className="relative overflow-hidden">
      <div className="container-port relative py-28 md:py-40">
        <div className="mb-20 flex items-center justify-between">
          <p className="kicker">Selected work</p>
          <p className="font-mono text-[10px] tracking-meta text-white/35">
            04<span className="text-violet-500"> / 06</span>
          </p>
        </div>
        <h2 data-rise className="max-w-3xl font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
          Real systems,
          <br />
          <span className="text-white/45">staged as</span> interactive worlds.
        </h2>
        <p data-rise className="mt-6 max-w-xl text-muted">
          Three builds, three environments. Scroll through a case to watch its
          world run — a learning path, a restaurant line, a repository being
          understood.
        </p>
      </div>

      <CaseStudy
        project={projects[0]}
        index={1}
        quality={quality}
        reduced={reduced}
        Scene={SyllabusScene}
        stages={[
          { at: 0.0, label: 'Choose a path' },
          { at: 0.2, label: 'Open the syllabus' },
          { at: 0.45, label: 'Mark subtopic progress' },
          { at: 0.68, label: 'Notes · streaks · heatmap' },
          { at: 0.9, label: 'Review the charts' },
        ]}
      />

      <CaseGap to="02" label="into the restaurant line" />

      {projects[1] && (
        <CaseStudy
          project={projects[1]}
          index={2}
          quality={quality}
          reduced={reduced}
          Scene={RestroScene}
          stages={[
            { at: 0.0, label: 'Table & QR' },
            { at: 0.18, label: 'Menu' },
            { at: 0.4, label: 'Cart & order' },
            { at: 0.62, label: 'Real-time status' },
            { at: 0.9, label: 'Kitchen & admin' },
          ]}
        />
      )}

      <CaseGap to="03" label="into the analysis" />

      {projects[2] && (
        <CaseStudy
          project={projects[2]}
          index={3}
          quality={quality}
          reduced={reduced}
          Scene={RepoReadyScene}
          stages={[
            { at: 0.0, label: 'Connect GitHub' },
            { at: 0.18, label: 'Analyze the codebase' },
            { at: 0.36, label: 'Map architecture' },
            { at: 0.55, label: 'Find knowledge gaps' },
            { at: 0.72, label: 'Generate questions' },
            { at: 0.88, label: 'Defend & score' },
          ]}
        />
      )}
    </section>
  )
}