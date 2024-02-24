export interface IEmote {
  name: string
  friendly_name: string
  emote: string
}

export interface ITimeout {
  reason: string
  timestamp_mutedEnd: string
  moderator: string
  active: boolean
}

export interface IBan {
  reason: string
  moderator: string
  active: boolean
}

export interface IChatStatus {
  type: 'timeout' | 'ban'
  object:   ITimeout | IBan
}

export const isIBan = (object: any): object is IBan  => {
  return !('timestamp_mutedEnd' in object);
}