import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { Pillar } from '../../data/questions'
import { PILLAR_META } from '../../data/questions'

interface Props {
  scores: Record<string, number>
  size?: number
  blurred?: boolean
  animate?: boolean
  showLabels?: boolean
}

export interface SpectraHandle {
  toDataURL: () => string
}

const PILLARS: Pillar[] = ['H', 'E', 'A', 'R', 'T', 'I']

export const SpectraChart = forwardRef<SpectraHandle, Props>(
  function SpectraChart(
    { scores, size = 320, blurred = false, animate = true, showLabels = true },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useImperativeHandle(ref, () => ({
      toDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
    }))

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const s = size * dpr
      canvas.width = s
      canvas.height = s
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)

      const cx = size / 2
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

      ctx.clearRect(0, 0, size, size)

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
        ctx.strokeStyle = level === 5 ? 'rgba(75,63,160,0.18)' : 'rgba(75,63,160,0.08)'
        ctx.lineWidth = level === 5 ? 1.2 : 0.8
        ctx.stroke()
      }

      // Spokes
      for (let i = 0; i < n; i++) {
        const outer = pointAt(i, maxR)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(outer.x, outer.y)
        ctx.strokeStyle = 'rgba(75,63,160,0.1)'
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
      ctx.fillStyle = blurred ? 'rgba(75,63,160,0.12)' : 'rgba(75,63,160,0.15)'
      ctx.fill()
      ctx.strokeStyle = '#4B3FA0'
      ctx.lineWidth = 2
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
          const labelR = maxR + 36
          const pt = pointAt(i, labelR)
          const meta = PILLAR_META[p]

          ctx.font = 'bold 11px system-ui, sans-serif'
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
    }, [scores, size, blurred, showLabels])

    return (
      <canvas
        ref={canvasRef}
        className={`spectra-canvas${animate ? ' spectra-animate' : ''}`}
        style={blurred ? { filter: 'blur(3px)', userSelect: 'none' } : {}}
      />
    )
  }
)
