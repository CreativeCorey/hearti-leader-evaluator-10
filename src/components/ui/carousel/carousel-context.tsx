
import * as React from "react"
import { type UseCarouselReturn } from "./use-carousel"

export const CarouselContext = React.createContext<UseCarouselReturn | null>(null)

export function useCarouselContext() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}
