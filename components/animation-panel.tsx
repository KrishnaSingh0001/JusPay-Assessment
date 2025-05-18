"use client"

import { useState } from "react"
import { type Sprite, type Animation, AnimationType } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Trash2, RotateCw, MapPin, MessageSquare, MessageCircle, Repeat } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

interface AnimationPanelProps {
  sprite: Sprite
  addAnimation: (animation: Animation) => void
  removeAnimation: (index: number) => void
  updateAnimation: (index: number, animation: Animation) => void
}

export default function AnimationPanel({
  sprite,
  addAnimation,
  removeAnimation,
  updateAnimation,
}: AnimationPanelProps) {
  const [activeTab, setActiveTab] = useState("motion")

  // Motion animation states
  const [moveSteps, setMoveSteps] = useState(10)
  const [turnDegrees, setTurnDegrees] = useState(15)
  const [gotoX, setGotoX] = useState(200)
  const [gotoY, setGotoY] = useState(200)

  // Looks animation states
  const [sayText, setSayText] = useState("Hello!")
  const [sayDuration, setSayDuration] = useState(2)
  const [thinkText, setThinkText] = useState("Hmm...")
  const [thinkDuration, setThinkDuration] = useState(2)

  // Repeat animation state
  const [repeatCount, setRepeatCount] = useState(10)

  const handleAddMoveAnimation = () => {
    addAnimation({
      id: `anim-${Date.now()}`,
      type: AnimationType.MOVE,
      steps: moveSteps,
    })
  }

  const handleAddTurnAnimation = () => {
    addAnimation({
      id: `anim-${Date.now()}`,
      type: AnimationType.TURN,
      degrees: turnDegrees,
    })
  }

  const handleAddGotoAnimation = () => {
    addAnimation({
      id: `anim-${Date.now()}`,
      type: AnimationType.GOTO,
      x: gotoX,
      y: gotoY,
    })
  }

  const handleAddSayAnimation = () => {
    addAnimation({
      id: `anim-${Date.now()}`,
      type: AnimationType.SAY,
      text: sayText,
      duration: sayDuration,
    })
  }

  const handleAddThinkAnimation = () => {
    addAnimation({
      id: `anim-${Date.now()}`,
      type: AnimationType.THINK,
      text: thinkText,
      duration: thinkDuration,
    })
  }

  const handleAddRepeatAnimation = () => {
    addAnimation({
      id: `anim-${Date.now()}`,
      type: AnimationType.REPEAT,
      count: repeatCount,
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = sprite.animations.findIndex((anim) => anim.id === active.id)
      const newIndex = sprite.animations.findIndex((anim) => anim.id === over.id)

      const newAnimations = [...sprite.animations]
      const [movedItem] = newAnimations.splice(oldIndex, 1)
      newAnimations.splice(newIndex, 0, movedItem)

      // Update all animations
      newAnimations.forEach((anim, index) => {
        updateAnimation(index, anim)
      })
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Animations for {sprite.name}</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="motion">Motion</TabsTrigger>
          <TabsTrigger value="looks">Looks</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
        </TabsList>

        <TabsContent value="motion" className="space-y-4 pt-4">
          <div className="bg-blue-100 p-3 rounded-md flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-600" />
            <span>Move</span>
            <Input
              type="number"
              value={moveSteps}
              onChange={(e) => setMoveSteps(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <span>steps</span>
            <Button onClick={handleAddMoveAnimation} size="sm" className="ml-auto">
              Add
            </Button>
          </div>

          <div className="bg-blue-100 p-3 rounded-md flex items-center gap-2">
            <RotateCw className="h-5 w-5 text-blue-600" />
            <span>Turn</span>
            <Input
              type="number"
              value={turnDegrees}
              onChange={(e) => setTurnDegrees(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <span>degrees</span>
            <Button onClick={handleAddTurnAnimation} size="sm" className="ml-auto">
              Add
            </Button>
          </div>

          <div className="bg-blue-100 p-3 rounded-md flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Go to x:</span>
            <Input
              type="number"
              value={gotoX}
              onChange={(e) => setGotoX(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <span>y:</span>
            <Input
              type="number"
              value={gotoY}
              onChange={(e) => setGotoY(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <Button onClick={handleAddGotoAnimation} size="sm" className="ml-auto">
              Add
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="looks" className="space-y-4 pt-4">
          <div className="bg-purple-100 p-3 rounded-md flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span>Say</span>
            <Input type="text" value={sayText} onChange={(e) => setSayText(e.target.value)} className="w-32" />
            <span>for</span>
            <Input
              type="number"
              value={sayDuration}
              onChange={(e) => setSayDuration(Number.parseFloat(e.target.value))}
              className="w-20"
            />
            <span>seconds</span>
            <Button onClick={handleAddSayAnimation} size="sm" className="ml-auto">
              Add
            </Button>
          </div>

          <div className="bg-purple-100 p-3 rounded-md flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <span>Think</span>
            <Input type="text" value={thinkText} onChange={(e) => setThinkText(e.target.value)} className="w-32" />
            <span>for</span>
            <Input
              type="number"
              value={thinkDuration}
              onChange={(e) => setThinkDuration(Number.parseFloat(e.target.value))}
              className="w-20"
            />
            <span>seconds</span>
            <Button onClick={handleAddThinkAnimation} size="sm" className="ml-auto">
              Add
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="control" className="space-y-4 pt-4">
          <div className="bg-orange-100 p-3 rounded-md flex items-center gap-2">
            <Repeat className="h-5 w-5 text-orange-600" />
            <span>Repeat</span>
            <Input
              type="number"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <span>times</span>
            <Button onClick={handleAddRepeatAnimation} size="sm" className="ml-auto">
              Add
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <h3 className="font-bold mb-2">Animation Sequence</h3>

        {sprite.animations.length === 0 ? (
          <div className="bg-slate-100 p-4 rounded-md text-slate-500 text-center">
            No animations added yet. Add some from the panels above.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={sprite.animations.map((anim) => anim.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sprite.animations.map((animation, index) => (
                  <SortableAnimationItem
                    key={animation.id}
                    animation={animation}
                    onRemove={() => removeAnimation(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

interface SortableAnimationItemProps {
  animation: Animation
  onRemove: () => void
}

function SortableAnimationItem({ animation, onRemove }: SortableAnimationItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: animation.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderAnimationContent = () => {
    switch (animation.type) {
      case AnimationType.MOVE:
        return (
          <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-md">
            <ArrowRight className="h-5 w-5 text-blue-600" />
            <span>Move {animation.steps} steps</span>
          </div>
        )

      case AnimationType.TURN:
        return (
          <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-md">
            <RotateCw className="h-5 w-5 text-blue-600" />
            <span>Turn {animation.degrees} degrees</span>
          </div>
        )

      case AnimationType.GOTO:
        return (
          <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-md">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>
              Go to x: {animation.x} y: {animation.y}
            </span>
          </div>
        )

      case AnimationType.SAY:
        return (
          <div className="flex items-center gap-2 bg-purple-100 p-3 rounded-md">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span>
              Say "{animation.text}" for {animation.duration} seconds
            </span>
          </div>
        )

      case AnimationType.THINK:
        return (
          <div className="flex items-center gap-2 bg-purple-100 p-3 rounded-md">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <span>
              Think "{animation.text}" for {animation.duration} seconds
            </span>
          </div>
        )

      case AnimationType.REPEAT:
        return (
          <div className="flex items-center gap-2 bg-orange-100 p-3 rounded-md">
            <Repeat className="h-5 w-5 text-orange-600" />
            <span>Repeat {animation.count} times</span>
          </div>
        )

      default:
        return <div>Unknown animation type</div>
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-2 cursor-move">
      <div className="flex-1">{renderAnimationContent()}</div>
      <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
