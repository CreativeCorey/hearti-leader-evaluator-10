
import * as React from "react"
import { cn } from "@/lib/utils"
import { CarouselContext } from "./carousel-context"
import { useCarousel, type UseCarouselProps } from "./use-carousel"

export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseCarouselProps {}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      currentPage,
      setActivePage,
      ...props
    },
    ref
  ) => {
    const carousel = useCarousel({
      opts,
      plugins,
      orientation,
      setApi,
      currentPage,
      setActivePage,
    })

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          carousel.scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          carousel.scrollNext()
        }
      },
      [carousel.scrollPrev, carousel.scrollNext]
    )

    return (
      <CarouselContext.Provider value={carousel}>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"
