import Magnetic from './Magnetic'

/**
 * The primary CTA of the new design language: an uppercase text control with
 * an expanding underline and a directional arrow. Renders as <a>, as <button>,
 * or as a plain text row. Functionality is delegated entirely to the caller
 * via href/onClick — resume downloads, mailto, and external links all pass
 * through unchanged.
 */
export default function TextLink({
  label,
  children,
  href,
  onClick,
  target,
  rel,
  download,
  arrow = false,
  dim = false,
  magnetic = true,
  className = '',
  ariaLabel,
}) {
  const inner = (
    <>
      <span>{children || label}</span>
      {arrow && (
        <span className="tl-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  )

  const classes = `textlink ${dim ? 'is-dim' : ''} ${className}`

  const node = href ? (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      download={download}
      aria-label={ariaLabel}
      className={classes}
    >
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes}>
      {inner}
    </button>
  )

  if (!magnetic) return node
  return <Magnetic>{node}</Magnetic>
}