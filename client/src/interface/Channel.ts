export interface Stream {
  streamTitle: string
  category: string
  channelID: string
  viewers: string  
  timestamp: string
  tags: string[]
}

export interface Channel {
  clerk_id: string
  username: string
  pfp: string
  isLive: boolean
  isVerified: boolean
  channelMods: string[]
}

export interface Browse {
  channel: Channel
  stream: Stream
}