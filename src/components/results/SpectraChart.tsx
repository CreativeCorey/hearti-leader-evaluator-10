import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { Pillar } from '../../data/questions'
import { PILLAR_META } from '../../data/questions'

interface Props {
  scores: Record<string, number>
  size?: number
  blurred?: boolean
  animate?: boolean
  showLabels?: boolean
  strengthPillar?: string
  showCTA?: boolean
}

export interface SpectraHandle {
  toDataURL: () => string
}

const PILLARS: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']
const CTA_HEIGHT = 32

export const SpectraChart = forwardRef<SpectraHandle, Props>(
  function SpectraChart(
    { scores, size = 320, blurred = false, animate = true, showLabels = true, strengthPillar, showCTA = false },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const LABEL_PADDING = showLabels ? 44 : 0
    const canvasWidth = size + (showCTA ? 40 : 0) + LABEL_PADDING
    const canvasHeight = showCTA ? size + CTA_HEIGHT : size

    useImperativeHandle(ref, () => ({
      toDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
    }))

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`
      ctx.scale(dpr, dpr)

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Solid white background for share version
      if (showCTA) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      }

      const cx = canvasWidth / 2
      const cy = size / 2
      const maxR = (size / 2) - (showLabels ? 52 : 28)
      const n = PILLARS.length

      const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

      const pointAt = (i: number, r: number) => ({
        x: cx + Math.cos(angleFor(i)) * r,
        y: cy + Math.sin(angleFor(i)) * r,
      })

      const scoreR = (pillar: Pillar) => {
        const sc = scores[pillar] ?? 0
        return ((sc - 1) / 4) * maxR
      }

      // Grid rings
      for (let level = 1; level <= 5; level++) {
        const r = (level / 5) * maxR
        ctx.beginPath()
        for (let i = 0; i <= n; i++) {
          const pt = pointAt(i % n, r)
          if (i === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.closePath()
        ctx.strokeStyle = level === 5 ? 'rgba(75,63,160,0.25)' : 'rgba(75,63,160,0.12)'
        ctx.lineWidth = level === 5 ? 1.2 : 0.8
        ctx.stroke()
      }

      // Spokes
      for (let i = 0; i < n; i++) {
        const outer = pointAt(i, maxR)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(outer.x, outer.y)
        ctx.strokeStyle = 'rgba(75,63,160,0.15)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Filled polygon
      ctx.beginPath()
      PILLARS.forEach((p, i) => {
        const pt = pointAt(i, scoreR(p))
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      })
      ctx.closePath()
      ctx.fillStyle = blurred ? 'rgba(75,63,160,0.40)' : 'rgba(75,63,160,0.15)'
      ctx.fill()
      ctx.strokeStyle = '#4B3FA0'
      ctx.lineWidth = blurred ? 2.5 : 2
      ctx.stroke()

      // Data points
      PILLARS.forEach((p, i) => {
        const r = scoreR(p)
        const pt = pointAt(i, r)
        const color = PILLAR_META[p].color

        ctx.beginPath()
        ctx.arc(pt.x, pt.y, blurred ? 5 : 6, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Labels
      if (showLabels) {
        PILLARS.forEach((p, i) => {
          const labelR = maxR + 32
          const pt = pointAt(i, labelR)
          const meta = PILLAR_META[p]

          ctx.font = 'bold 10px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = meta.color
          ctx.fillText(meta.name, pt.x, pt.y - 5)

          if (!blurred) {
            ctx.font = '10px system-ui, sans-serif'
            ctx.fillStyle = 'rgba(26,26,46,0.55)'
            ctx.fillText((scores[p] ?? 0).toFixed(2), pt.x, pt.y + 9)
          }
        })
      }

      // Block A — strength letter at center (hidden when blurred)
      if (strengthPillar && !blurred && PILLAR_META[strengthPillar as Pillar]) {
        const color = PILLAR_META[strengthPillar as Pillar].color
        ctx.beginPath()
        ctx.arc(cx, cy, 22, 0, Math.PI * 2)
        ctx.fillStyle = color + '22'
        ctx.fill()
        ctx.font = 'bold 28px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = color
        ctx.fillText(strengthPillar, cx, cy)
      }

      // Block B — CTA strip and text at bottom
      if (showCTA) {
        const ctaY = size + CTA_HEIGHT / 2
        ctx.fillStyle = '#EDE9FA'
        ctx.fillRect(0, size, canvasWidth, CTA_HEIGHT)
        ctx.strokeStyle = 'rgba(75,63,160,0.15)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(24, size + 6)
        ctx.lineTo(canvasWidth - 24, size + 6)
        ctx.stroke()
        ctx.font = 'bold 12px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#4B3FA0'
        ctx.fillText('Find your leadership strength at heartiquotient.com', canvasWidth / 2, ctaY)
      }
    }, [scores, size, canvasHeight, canvasWidth, blurred, showLabels, strengthPillar, showCTA])

    return (
      <canvas
        ref={canvasRef}
        className={`spectra-canvas${animate ? ' spectra-animate' : ''}`}
        style={blurred ? { filter: 'blur(3px)', userSelect: 'none' } : {}}
      />
    )
  }
)
