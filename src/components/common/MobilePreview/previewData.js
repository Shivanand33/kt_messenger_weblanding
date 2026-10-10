import maleAvatar from '../../../assets/images/social-media-platform-male-avatar.png'
import femaleAvatar from '../../../assets/images/social-networking-app-female-avatar.png'
import nadiaAvatar from '../../../assets/images/ai-assistant-nadia-avatar.png'
import privateAvatar from '../../../assets/images/messaging-app-private-chat.jpg'
import businessAvatar from '../../../assets/images/online-marketplace-app-business.jpg'
import communityAvatar from '../../../assets/images/group-chat-app-community.jpg'
import beachPhoto from '../../../assets/images/social-media-app-beach-bicycles.png'
import sunsetPhoto from '../../../assets/images/video-social-network-sunset-landscape.png'
import landscapePhoto from '../../../assets/images/hd_landscape.png'
import parrotPhoto from '../../../assets/images/crystal_tropical_parrot.png'
import cityPhoto from '../../../assets/images/cyberpunk_neon_city.png'
import marsPhoto from '../../../assets/images/astronaut_unicorn_mars.png'

/**
 * Cast and content for the in-hero "Mobile Preview" prototype.
 *
 * Every person, group, handle and phone number here is invented for the demo —
 * none of it is a real contact. Numbers use the +1 555 01xx block, which is
 * reserved for fiction, so a curious visitor who dials one reaches nobody.
 */

export const ME = { name: 'Alex Morgan', about: 'Busy', number: '+1 555 0117', avatar: maleAvatar }

export const AVATARS = {
  male: maleAvatar,
  female: femaleAvatar,
  nadia: nadiaAvatar,
  private: privateAvatar,
  business: businessAvatar,
  community: communityAvatar,
}

export const PHOTOS = {
  beach: beachPhoto,
  sunset: sunsetPhoto,
  landscape: landscapePhoto,
  parrot: parrotPhoto,
  city: cityPhoto,
  mars: marsPhoto,
}

/** The contact the call screens and the open thread are built around. */
export const CALLER = { name: 'Sophia Lee', number: '+1 555 0142', avatar: femaleAvatar }

/** Chats tab — mixes groups (initial tiles) and people (photos), like the app. */
export const CHATS = [
  { id: 'c1', name: 'Design Crew', preview: 'Mia: Final mockups are in', time: '4:24 PM', unread: 1, tone: 'sky', group: true },
  { id: 'c2', name: 'Release Room', preview: 'Build 4.2 is live on both stores', time: '4:13 PM', initials: 'RR', tone: 'violet' },
  { id: 'c3', name: '+1 555 0168', preview: 'Hi there!', time: '4:09 PM', avatar: privateAvatar },
  { id: 'c4', name: 'Daniel Reed', preview: 'Document', time: '3:44 PM', avatar: maleAvatar, muted: true, doc: true },
  { id: 'c5', name: 'Marketing Team', preview: 'Olivia: Deck is ready for review', time: '3:36 PM', unread: 26, initials: 'MT', tone: 'purple' },
  { id: 'c6', name: 'Weekend Riders', preview: 'Noah: Sunrise ride on Saturday?', time: '3:35 PM', unread: 4, initials: 'WR', tone: 'amber' },
  { id: 'c7', name: 'Coffee Addicts', preview: 'Missed video call', time: '1:58 PM', initials: 'CA', tone: 'orange', missed: true },
  { id: 'c8', name: 'Emma Clarke', preview: 'Sounds perfect, see you then!', time: '1:12 PM', avatar: femaleAvatar },
]

/** Calls tab. */
export const CALLS = [
  { id: 'k1', name: 'Design Crew (2)', time: '1:31 PM', dir: 'in', kind: 'video', avatar: communityAvatar },
  { id: 'k2', name: '+1 555 0168', time: '12:54 PM', dir: 'out', kind: 'voice', avatar: privateAvatar },
  { id: 'k3', name: 'James Carter', time: '11:54 AM', meta: '36s', dir: 'in', kind: 'video', avatar: maleAvatar },
  { id: 'k4', name: 'James Carter', time: '11:54 AM', meta: '9s', dir: 'out', kind: 'video', avatar: maleAvatar },
  { id: 'k5', name: 'Olivia Bennett', time: '11:52 AM', dir: 'out', kind: 'video', avatar: femaleAvatar },
  { id: 'k6', name: 'Marketing Team', time: '11:30 AM', meta: '3 participants', dir: 'out', kind: 'voice', avatar: businessAvatar },
  { id: 'k7', name: 'Sophia Lee', time: '11:30 AM', meta: '9s', dir: 'out', kind: 'voice', avatar: femaleAvatar },
  { id: 'k8', name: 'Noah Wilson', time: '11:13 AM', dir: 'out', kind: 'voice', avatar: nadiaAvatar },
]

/** Updates tab — status ring rail plus followed channels. */
export const STATUSES = [
  { id: 's1', name: 'Liam Walker', time: '4h ago', cover: cityPhoto, initials: 'LW', tone: 'emerald' },
  { id: 's2', name: 'Olivia Bennett', time: '5h ago', cover: parrotPhoto, avatar: femaleAvatar },
  { id: 's3', name: 'KT Updates', time: '7h ago', cover: landscapePhoto, avatar: businessAvatar },
]

export const CHANNELS = [
  { id: 'ch1', name: 'Studio Artbox', preview: 'Couple portrait', time: '18 Aug', initials: 'SA', tone: 'teal', kind: 'photo' },
  { id: 'ch2', name: 'Trailblazers', preview: 'Last rider vs the pack', time: '2:32 PM', initials: 'TB', tone: 'emerald', unread: 88, kind: 'video' },
  { id: 'ch3', name: 'KT Updates', preview: 'Photo', time: '28 Sep', avatar: businessAvatar, unread: 4, kind: 'photo' },
  { id: 'ch4', name: 'Pets and Fun', preview: 'Smart escape, every Friday', time: '19 Sep', initials: 'PF', tone: 'violet', unread: 50, kind: 'video' },
  { id: 'ch5', name: 'Tech Pulse', preview: 'Daily tech drops land here', time: '28 Aug', avatar: nadiaAvatar, kind: 'text' },
  { id: 'ch6', name: 'Wander Weekly', preview: 'Photo', time: '31 Jul', avatar: communityAvatar, kind: 'photo' },
]

/** News tab — invented headlines and outlets, so nothing is attributed falsely. */
export const NEWS_TRENDING = [
  { id: 'n1', title: 'Coastal cities open the first tidal power grid', ago: '11h ago', cover: landscapePhoto },
  { id: 'n2', title: 'Two studios merge to form a new streaming house', ago: '14h ago', cover: cityPhoto },
]

export const NEWS_RECENT = [
  { id: 'r1', title: 'Coastal cities open the first tidal power grid', source: 'Global Wire', ago: '11h ago', cover: landscapePhoto },
  { id: 'r2', title: 'Two studios merge to form a new streaming house', source: 'Finance Daily', ago: '14h ago', cover: cityPhoto },
  { id: 'r3', title: 'Teams map a safer route for the deep-sea cable', source: 'Tech Pulse', ago: '1d ago', cover: parrotPhoto },
  { id: 'r4', title: 'City marathon returns with a record sign-up week', source: 'Sports Room', ago: '1d ago', cover: beachPhoto },
]

/**
 * Minis tab — a single short-video card. `captions` are the burned-in subtitle
 * lines the clip cycles through while it plays, which is what makes the still
 * read as moving footage rather than a photo.
 */
export const MINI = {
  handle: '@mayaonmotion',
  caption: 'Five-minute resets that bring your focus back',
  captions: [
    'Five-minute resets that bring your focus back',
    'Start with one slow breath, nothing else',
    'Then pick the smallest task on the list',
    'Finish it before you touch your phone again',
  ],
  cover: marsPhoto,
  likes: 2412,
  comments: '18',
}

/** Status viewer — the promo card the demo account just posted. */
export const STATUS_POST = { author: 'You', time: 'a moment ago', cover: sunsetPhoto }

/**
 * Languages list for the picker. The real screen is scrolled to the top, so the
 * A–B slice is all that is ever visible inside the frame.
 */
export const LANGUAGES = [
  { native: 'Afrikaans', english: '', flag: 'ZA' },
  { native: 'Shqip', english: 'Albanian', flag: 'AL' },
  { native: 'አማርኛ', english: 'Amharic', flag: 'ET' },
  { native: 'العربية', english: 'Arabic', flag: 'SA' },
  { native: 'Հայերեն', english: 'Armenian', flag: 'AM' },
  { native: 'Azərbaycan', english: 'Azerbaijani', flag: 'AZ' },
  { native: 'Беларуская', english: 'Belarusian', flag: 'BY' },
  { native: 'বাংলা', english: 'Bengali', flag: 'BD' },
]
