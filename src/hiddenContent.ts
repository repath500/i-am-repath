import type { Note } from './notes'

export type RepathLetter = {
  id: string
  paragraphs: readonly string[]
  signOff: string
}

export const hiddenNote: Note = {
  mood: 'soft',
  text: "thank you for reading all of it. every note, every line you listened to or let sit in you. most people skim and leave. you didn't. i don't know what you're carrying right now, but you stayed long enough to hear someone else's becoming—and that means something to me. not as a metric. as a person who chose to listen when it would have been easier to scroll past. i'm grateful you were here. keep going.",
}

const childhoodLetterParagraphs = [
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

const middleLetterParagraphs = [
  "i don't really know what i'm chasing right now.",
  "i've tried building things. i've tried starting again. i've tried convincing myself that the next idea, the next app, the next project, the next version of me would finally make everything click.",
  "but sometimes it just doesn't.",
  "sometimes you put everything you have into something and it still goes nowhere. sometimes you keep showing up, keep learning, keep shipping, keep pretending you're fine, and deep down you're just tired. not broken. not finished. just tired in a way that is hard to explain.",
  "i think the hardest part is having ambition with no clear direction. wanting more, but not knowing where to put that want. knowing you're capable of something, but not knowing what that something is. watching time move while you feel stuck in the same place.",
  "i don't want pity. i don't want some perfect motivational quote. i just want to be honest for once.",
  "i'm frustrated. i'm lost. i'm questioning things i used to be sure about. i'm wondering if the path i kept choosing is even mine anymore.",
  "but even with all of that, there is still something in me that hasn't fully given up.",
  "maybe that's stubbornness. maybe that's hope. maybe that's just the small part of me that still remembers i didn't come this far just to disappear quietly.",
  'so this is where i am right now.',
  'not at the end. not at the breakthrough either.',
  'just somewhere in the middle, trying to understand what comes next.',
] as const

export const repathPublicLetters: RepathLetter[] = [
  {
    id: 'childhood',
    paragraphs: childhoodLetterParagraphs,
    signOff: '— repath',
  },
  {
    id: 'middle',
    paragraphs: middleLetterParagraphs,
    signOff: '— repath',
  },
]

export const getRepathPublicLetter = (id: string) =>
  repathPublicLetters.find((letter) => letter.id === id)

export const getRepathPublicLetterSpeakText = (letter: RepathLetter) =>
  `${letter.paragraphs.join('\n\n')}\n\nrepath`

/** @deprecated use repathPublicLetters */
export const repathPublicLetterParagraphs = repathPublicLetters[0].paragraphs

/** @deprecated use getRepathPublicLetterSpeakText */
export const repathPublicLetterText = repathPublicLetterParagraphs.join('\n\n')

/** @deprecated use repathPublicLetters */
export const repathPublicLetterSignOff = repathPublicLetters[0].signOff

/** @deprecated use getRepathPublicLetterSpeakText */
export const repathPublicLetterSpeakText = getRepathPublicLetterSpeakText(
  repathPublicLetters[0],
)

export const letterFrameLines = [
  "but i'm still here.",
  'still trying. still building. still becoming someone.',
  "and even with everything life throws, i still believe i'm going to win. not because it's easy. not because i've had it all figured out. but because something in me refuses to let the hard parts be the whole story.",
  "i'm not done.",
  'not even close.',
  "it's strange looking back, because you don't always realise you're living through the days you'll miss later.",
  "i'm writing this because one day, even this moment will feel far away. and maybe when i look back, i'll remember that even when life felt heavy, i still believed there was more ahead.",
  'not broken. not finished. just tired in a way that is hard to explain.',
  "but even with all of that, there is still something in me that hasn't fully given up.",
  'just somewhere in the middle, trying to understand what comes next.',
] as const
