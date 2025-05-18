export enum AnimationType {
    MOVE = "move",
    TURN = "turn",
    GOTO = "goto",
    SAY = "say",
    THINK = "think",
    REPEAT = "repeat",
  }
  
  export interface Animation {
    id: string
    type: AnimationType
    steps?: number // For MOVE
    degrees?: number // For TURN
    x?: number // For GOTO
    y?: number // For GOTO
    text?: string // For SAY, THINK
    duration?: number // For SAY, THINK
    count?: number // For REPEAT
  }
  
  export interface Sprite {
    id: string
    name: string
    x: number
    y: number
    direction: number
    animations: Animation[]
    sayText: string
    thinkText: string
    textDuration: number
    textTimer: number
    width: number
    height: number
    color: string
  }