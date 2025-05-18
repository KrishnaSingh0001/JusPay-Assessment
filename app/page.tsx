"use client"

import { useState, useEffect, useRef } from "react"
import SpriteCanvas from "@/components/sprite-canvas"
import AnimationPanel from "@/components/animation-panel"
import { type Sprite, type Animation, AnimationType } from "@/types/types"
import { Plus, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkCollision } from "@/lib/utils"

export default function Home() {
  const [sprites, setSprites] = useState<Sprite[]>([])
  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  // Initialize with a default sprite
  useEffect(() => {
    if (sprites.length === 0) {
      addNewSprite()
    }
  }, [sprites.length])

  const addNewSprite = () => {
    const newSprite: Sprite = {
      id: `sprite-${Date.now()}`,
      name: `Sprite ${sprites.length + 1}`,
      x: 200,
      y: 200,
      direction: 90,
      animations: [],
      sayText: "",
      thinkText: "",
      textDuration: 0,
      textTimer: 0,
      width: 80,
      height: 80,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
    }

    setSprites((prev) => [...prev, newSprite])
    setSelectedSpriteId(newSprite.id)
  }

  const updateSprite = (updatedSprite: Sprite) => {
    setSprites((prev) => prev.map((sprite) => (sprite.id === updatedSprite.id ? updatedSprite : sprite)))
  }

  const addAnimation = (spriteId: string, animation: Animation) => {
    setSprites((prev) =>
      prev.map((sprite) => {
        if (sprite.id === spriteId) {
          return {
            ...sprite,
            animations: [...sprite.animations, animation],
          }
        }
        return sprite
      }),
    )
  }

  const removeAnimation = (spriteId: string, animationIndex: number) => {
    setSprites((prev) =>
      prev.map((sprite) => {
        if (sprite.id === spriteId) {
          const newAnimations = [...sprite.animations]
          newAnimations.splice(animationIndex, 1)
          return {
            ...sprite,
            animations: newAnimations,
          }
        }
        return sprite
      }),
    )
  }

  const updateAnimation = (spriteId: string, animationIndex: number, updatedAnimation: Animation) => {
    setSprites((prev) =>
      prev.map((sprite) => {
        if (sprite.id === spriteId) {
          const newAnimations = [...sprite.animations]
          newAnimations[animationIndex] = updatedAnimation
          return {
            ...sprite,
            animations: newAnimations,
          }
        }
        return sprite
      }),
    )
  }

  const executeAnimations = () => {
    // Only continue if we're playing
    if (!isPlaying) {
      return
    }

    setSprites((prevSprites) => {
      const newSprites = JSON.parse(JSON.stringify(prevSprites)) // Deep clone to avoid mutation issues

      // Process animations for each sprite
      newSprites.forEach((sprite) => {
        // Process text timers
        if (sprite.textTimer > 0) {
          sprite.textTimer -= 1 / 60 // Assuming 60fps
          if (sprite.textTimer <= 0) {
            sprite.sayText = ""
            sprite.thinkText = ""
          }
        }

        // Process animations
        if (sprite.animations && sprite.animations.length > 0) {
          sprite.animations.forEach((animation) => {
            if (!animation) return

            switch (animation.type) {
              case AnimationType.MOVE:
                if (typeof animation.steps === "number") {
                  const radians = (sprite.direction - 90) * (Math.PI / 180)
                  sprite.x += animation.steps * Math.cos(radians) * 0.1 // Slow down movement for visibility
                  sprite.y += animation.steps * Math.sin(radians) * 0.1
                }
                break

              case AnimationType.TURN:
                if (typeof animation.degrees === "number") {
                  sprite.direction = (sprite.direction + animation.degrees * 0.1) % 360 // Slow down rotation
                }
                break

              case AnimationType.GOTO:
                if (typeof animation.x === "number" && typeof animation.y === "number") {
                  // Move gradually towards the target
                  const dx = animation.x - sprite.x
                  const dy = animation.y - sprite.y
                  sprite.x += dx * 0.05
                  sprite.y += dy * 0.05
                }
                break

              case AnimationType.SAY:
                if (animation.text && typeof animation.duration === "number") {
                  sprite.sayText = animation.text
                  sprite.thinkText = ""
                  sprite.textDuration = animation.duration
                  sprite.textTimer = animation.duration
                }
                break

              case AnimationType.THINK:
                if (animation.text && typeof animation.duration === "number") {
                  sprite.thinkText = animation.text
                  sprite.sayText = ""
                  sprite.textDuration = animation.duration
                  sprite.textTimer = animation.duration
                }
                break
            }
          })
        }
      })

      // Check for collisions between sprites
      for (let i = 0; i < newSprites.length; i++) {
        for (let j = i + 1; j < newSprites.length; j++) {
          if (checkCollision(newSprites[i], newSprites[j])) {
            // Swap animations for the hero feature
            const tempAnimations = [...newSprites[i].animations]
            newSprites[i].animations = [...newSprites[j].animations]
            newSprites[j].animations = tempAnimations
          }
        }
      }

      return newSprites
    })

    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(executeAnimations)
  }

  const togglePlayback = () => {
    if (isPlaying) {
      // Stop the animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      setIsPlaying(false)
    } else {
      // Start the animation
      setIsPlaying(true)
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(executeAnimations)
      }
    }
  }

  useEffect(() => {
    // Start animation if isPlaying is true
    if (isPlaying && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(executeAnimations)
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isPlaying]) // Add isPlaying as a dependency

  const selectedSprite = sprites.find((sprite) => sprite.id === selectedSpriteId)

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="text-2xl font-bold">Scratch Clone</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sprite list sidebar */}
        <div className="w-64 bg-slate-100 p-4 border-r overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Sprites</h2>
            <Button variant="outline" size="sm" onClick={addNewSprite} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>

          <div className="space-y-2">
            {sprites.map((sprite) => (
              <div
                key={sprite.id}
                className={`p-2 rounded cursor-pointer flex items-center ${
                  selectedSpriteId === sprite.id ? "bg-slate-300" : "bg-slate-200 hover:bg-slate-300"
                }`}
                onClick={() => setSelectedSpriteId(sprite.id)}
              >
                <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: sprite.color }} />
                <span>{sprite.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas area */}
          <div className="flex-1 relative border-b">
            <SpriteCanvas sprites={sprites} selectedSpriteId={selectedSpriteId} updateSprite={updateSprite} />

            <div className="absolute bottom-4 right-4">
              <Button
                onClick={togglePlayback}
                className="flex items-center gap-2"
                variant={isPlaying ? "destructive" : "default"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Play</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Animation panel */}
          <div className="h-1/3 bg-slate-50 p-4 overflow-y-auto">
            {selectedSprite ? (
              <AnimationPanel
                sprite={selectedSprite}
                addAnimation={(animation) => addAnimation(selectedSprite.id, animation)}
                removeAnimation={(index) => removeAnimation(selectedSprite.id, index)}
                updateAnimation={(index, animation) => updateAnimation(selectedSprite.id, index, animation)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Select a sprite to add animations
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
