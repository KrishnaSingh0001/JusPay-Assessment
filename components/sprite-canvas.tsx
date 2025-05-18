"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import type { Sprite } from "@/types/types"

interface SpriteCanvasProps {
  sprites: Sprite[]
  selectedSpriteId: string | null
  updateSprite: (sprite: Sprite) => void
}

export default function SpriteCanvas({ sprites, selectedSpriteId, updateSprite }: SpriteCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent, sprite: Sprite) => {
    if (sprite.id !== selectedSpriteId) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const offsetX = e.clientX - (rect.left + sprite.x)
    const offsetY = e.clientY - (rect.top + sprite.y)

    setDragOffset({ x: offsetX, y: offsetY })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !selectedSpriteId) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const selectedSprite = sprites.find((s) => s.id === selectedSpriteId)
    if (!selectedSprite) return

    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    updateSprite({
      ...selectedSprite,
      x: newX,
      y: newY,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, selectedSpriteId, sprites])

  return (
    <div ref={canvasRef} className="w-full h-full bg-white relative overflow-hidden">
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className={`absolute cursor-move ${sprite.id === selectedSpriteId ? "ring-2 ring-blue-500" : ""}`}
          style={{
            left: `${sprite.x - sprite.width / 2}px`,
            top: `${sprite.y - sprite.height / 2}px`,
            width: `${sprite.width}px`,
            height: `${sprite.height}px`,
            backgroundColor: sprite.color,
            borderRadius: "50%",
            transform: `rotate(${sprite.direction - 90}deg)`,
            transition: isDragging && sprite.id === selectedSpriteId ? "none" : "transform 0.3s ease",
          }}
          onMouseDown={(e) => handleMouseDown(e, sprite)}
        >
          {/* Direction indicator */}
          <div
            className="absolute bg-white w-3 h-3 rounded-full"
            style={{
              left: "50%",
              top: "10%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Speech bubble */}
          {sprite.sayText && (
            <div className="absolute left-full ml-2 top-0 bg-white p-2 rounded-lg border shadow-sm max-w-[200px] z-10">
              <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent" />
              {sprite.sayText}
            </div>
          )}

          {/* Thought bubble */}
          {sprite.thinkText && (
            <div className="absolute left-full ml-6 top-0 bg-white p-2 rounded-lg border shadow-sm max-w-[200px] z-10">
              <div className="absolute left-[-20px] top-4 flex flex-col items-end">
                <div className="w-4 h-4 rounded-full bg-white mb-1" />
                <div className="w-2 h-2 rounded-full bg-white mb-1" />
              </div>
              {sprite.thinkText}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
