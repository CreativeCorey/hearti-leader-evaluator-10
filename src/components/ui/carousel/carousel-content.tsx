
import * as React from "react"
import { cn } from "@/lib/utils"
import { useCarouselContext } from "./carousel-context"

export interface CarouselContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  CarouselContentProps
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarouselContext()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"
