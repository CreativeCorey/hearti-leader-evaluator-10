
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

export type CarouselApi = UseEmblaCarouselType[1]
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
export type CarouselOptions = UseCarouselParameters[0]
export type CarouselPlugin = UseCarouselParameters[1]

export interface UseCarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  currentPage?: number
  setActivePage?: React.Dispatch<React.SetStateAction<number>>
}

export interface UseCarouselReturn {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation: "horizontal" | "vertical"
  currentPage?: number
  setActivePage?: React.Dispatch<React.SetStateAction<number>>
}

export function useCarousel({
  opts,
  plugins,
  orientation = "horizontal",
  setApi,
  currentPage,
  setActivePage,
}: UseCarouselProps): UseCarouselReturn {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    
    // Update the active page when the carousel slides
    if (setActivePage) {
      setActivePage(api.selectedScrollSnap())
    }
  }, [setActivePage])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  React.useEffect(() => {
    if (!api || !setApi) {
      return
    }

    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  // Sync carousel position with currentPage prop if it changes externally
  React.useEffect(() => {
    if (api && currentPage !== undefined && api.selectedScrollSnap() !== currentPage) {
      api.scrollTo(currentPage)
    }
  }, [api, currentPage])

  return {
    carouselRef,
    api,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    orientation,
    currentPage,
    setActivePage,
  }
}
