import { ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"


export function EmptyOutline() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageOff/>
        </EmptyMedia>
        <EmptyTitle>Image Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload product image.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Upload Images
        </Button>
      </EmptyContent>
    </Empty>
  )
}
