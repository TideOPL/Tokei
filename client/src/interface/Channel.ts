export interface Stream {
  title: string
  category: string
  clerkId: string
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

export interface Follow {
  timestamp: String
}

export interface Browse {
  channel: Channel
  stream: Stream
}

export interface ILiveFollowing {
  following: Channel
  stream?: Stream
}

export interface IStreamInfo {
  title: string
  category: string
  tags: string[]
}