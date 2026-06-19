import type { Note } from './notes'

export const hiddenNote: Note = {
  mood: 'soft',
  text: "thank you for reading all of it. every note, every line you listened to or let sit in you. most people skim and leave. you didn't. i don't know what you're carrying right now, but you stayed long enough to hear someone else's becoming—and that means something to me. not as a metric. as a person who chose to listen when it would have been easier to scroll past. i'm grateful you were here. keep going.",
}

export const repathPublicLetterParagraphs = [
  "i don't really know when everything changed.",
  "it feels like childhood disappeared quietly. not all at once, not in some dramatic way, but in little pieces. one day life was loud, simple, messy, full of small things that felt normal at the time. the house, the noise, growing up with my brothers, the random memories that didn't feel important back then but somehow mean everything now.",
  'then suddenly, life was different.',
  'the days got faster. people grew up. everyone started carrying their own weight. the world became bigger, but heavier too. things that used to feel far away started becoming real. responsibility, pressure, loss, ambition, disappointment, hope. all of it.',
  "it's strange looking back, because you don't always realise you're living through the days you'll miss later.",
  "i've had my tough times. more than i probably say out loud. the quiet kind. the kind that don't always look like anything from the outside, but still change something inside you. life can be hard like that. it keeps moving even when you're tired. it teaches you lessons before you feel ready to learn them.",
  "but i'm still here.",
  'still trying. still building. still becoming someone.',
  "and even with everything life throws, i still believe i'm going to win. not because it's easy. not because i've had it all figured out. but because something in me refuses to let the hard parts be the whole story.",
  "maybe that's why i wanted to make this.",
  'not to explain myself too much. not to turn my life into some perfect story. just to leave something honest somewhere. a small piece of how life feels right now. a reminder that time moves fast, childhood fades, people change, but the dream can still stay alive.',
  "and if you're reading this, maybe you should write something too.",
  "seal it, or don't. keep it private, or leave it open. write to your past self, your future self, someone you miss, someone you love, or just the version of you that exists today.",
  'life has its freedom.',
  'you do you.',
  "i'm writing this because one day, even this moment will feel far away. and maybe when i look back, i'll remember that even when life felt heavy, i still believed there was more ahead.",
  "i'm not done.",
  'not even close.',
] as const

export const repathPublicLetterText = repathPublicLetterParagraphs.join('\n\n')

export const repathPublicLetterSignOff = '— repath'

export const repathPublicLetterSpeakText = `${repathPublicLetterText}\n\nrepath`
