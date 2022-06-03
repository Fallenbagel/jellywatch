export type Root = {
  PlayState: PlayState;
  AdditionalUsers: any[];
  Capabilities: Capabilities;
  RemoteEndPoint: string;
  PlayableMediaTypes: string[];
  Id: string;
  UserId: string;
  UserName?: string;
  Client: string;
  LastActivityDate: string;
  LastPlaybackCheckIn: string;
  DeviceName?: string;
  NowPlayingItem?: NowPlayingItem;
  FullNowPlayingItem?: FullNowPlayingItem;
  DeviceId: string;
  ApplicationVersion: string;
  IsActive: boolean;
  SupportsMediaControl: boolean;
  SupportsRemoteControl: boolean;
  NowPlayingQueue: any[];
  NowPlayingQueueFullItems: any[];
  HasCustomDeviceName: boolean;
  PlaylistItemId?: string;
  ServerId: string;
  UserPrimaryImageTag?: string;
  SupportedCommands: string[];
};

export interface PlayState {
  PositionTicks?: number;
  CanSeek: boolean;
  IsPaused: boolean;
  IsMuted: boolean;
  VolumeLevel?: number;
  AudioStreamIndex?: number;
  SubtitleStreamIndex?: number;
  MediaSourceId?: string;
  PlayMethod?: string;
  RepeatMode: string;
}

export interface Capabilities {
  PlayableMediaTypes: string[];
  SupportedCommands: string[];
  SupportsMediaControl: boolean;
  SupportsContentUploading: boolean;
  SupportsPersistentIdentifier: boolean;
  SupportsSync: boolean;
}

export interface NowPlayingItem {
  Name: string;
  ServerId: string;
  Id: string;
  DateCreated: string;
  HasSubtitles: boolean;
  Container: string;
  PremiereDate: string;
  ExternalUrls: ExternalUrl[];
  Path: string;
  EnableMediaSourceDisplay: boolean;
  ChannelId: any;
  Overview: string;
  Taglines: any[];
  Genres: any[];
  CommunityRating: number;
  RunTimeTicks: number;
  ProductionYear: number;
  IndexNumber: number;
  ParentIndexNumber: number;
  ProviderIds: ProviderIds;
  IsFolder: boolean;
  ParentId: string;
  Type: string;
  Studios: any[];
  GenreItems: any[];
  ParentLogoItemId: string;
  ParentBackdropItemId: string;
  ParentBackdropImageTags: string[];
  LocalTrailerCount: number;
  SeriesName: string;
  SeriesId: string;
  SeasonId: string;
  SpecialFeatureCount: number;
  PrimaryImageAspectRatio: number;
  SeriesPrimaryImageTag: string;
  SeasonName: string;
  MediaStreams: MediaStream[];
  VideoType: string;
  ImageTags: ImageTags;
  BackdropImageTags: any[];
  ParentLogoImageTag: string;
  ImageBlurHashes: ImageBlurHashes;
  SeriesStudio: string;
  Chapters: Chapter[];
  LocationType: string;
  MediaType: string;
  Width: number;
  Height: number;
}

export interface ExternalUrl {
  Name: string;
  Url: string;
}

export interface ProviderIds {
  tvdb: string;
  sonarr: string;
}

export interface MediaStream {
  Codec: string;
  Language?: string;
  ColorSpace?: string;
  ColorTransfer?: string;
  ColorPrimaries?: string;
  TimeBase?: string;
  VideoRange?: string;
  DisplayTitle: string;
  NalLengthSize?: string;
  IsInterlaced: boolean;
  IsAVC?: boolean;
  BitRate?: number;
  BitDepth?: number;
  RefFrames?: number;
  IsDefault: boolean;
  IsForced: boolean;
  Height?: number;
  Width?: number;
  AverageFrameRate?: number;
  RealFrameRate?: number;
  Profile?: string;
  Type: string;
  AspectRatio?: string;
  Index: number;
  IsExternal: boolean;
  IsTextSubtitleStream: boolean;
  SupportsExternalStream: boolean;
  PixelFormat?: string;
  Level?: number;
  ChannelLayout?: string;
  Channels?: number;
  SampleRate?: number;
  LocalizedUndefined?: string;
  LocalizedDefault?: string;
  LocalizedForced?: string;
  LocalizedExternal?: string;
  Path?: string;
}

export interface ImageTags {
  Primary: string;
}

export interface ImageBlurHashes {
  Primary: Primary;
  Logo: Logo;
  Backdrop: Backdrop;
}

export interface Primary {
  "7e17423f46259f8727f20ac11a656773": string;
  "78129178a065edaafc8798238a18c663": string;
}

export interface Logo {
  f9e2122c32999a9a4fba3aa4d08a2753: string;
}

export interface Backdrop {
  "6f250e1c4e56123e216723c411486b52": string;
}

export interface Chapter {
  StartPositionTicks: number;
  Name: string;
  ImageDateModified: string;
}

export interface FullNowPlayingItem {
  Size: number;
  Container: string;
  IsHD: boolean;
  IsShortcut: boolean;
  Width: number;
  Height: number;
  ExtraIds: any[];
  DateLastSaved: string;
  RemoteTrailers: RemoteTrailer[];
  SupportsExternalTransfer: boolean;
}

export interface RemoteTrailer {
  Url: string;
}
