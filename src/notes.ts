export type Mood = 'light' | 'soft' | 'heavy'

export type Note = {
  text: string
  mood: Mood
  shipTie?: boolean
}

export const notes: Note[] = [
  { mood: 'soft', text: 'kindness is the sharpest thing i know. not softness, not the wish to be liked, but a steady decision to leave people lighter than i found them, even on the days no one would blame me for being colder.' },
  { mood: 'soft', text: 'who you are when no one is watching slowly becomes the whole shape of your life. the private self is the real one. everything else is just the part of it the world happens to see.' },
  { mood: 'soft', text: 'patience has a sound, and most days it is quiet. it is the breath you take before answering, the word you keep, the small refusal to rush a thing that was never yours to rush. a lot of peace comes from finally understanding that not everything needs your panic just because it needs your time.' },
  { mood: 'soft', text: 'you do not become yourself all at once. you choose it in small rooms, in unanswered messages, in the seconds you could have been crueler and were not. character is the sum of those invisible choices.' },
  { mood: 'light', text: 'remember the ordinary parts too. the walk home, the light through a window, the laugh after a hard week. most of a life is not the milestones. it is the quiet middle nobody photographs, the small hours that do not look important until years later when you realize they were the whole fucking blessing.' },
  { mood: 'light', text: 'motivation visits. resolve stays. one is a feeling that comes and goes with the weather, the other is a promise you keep to yourself long after the feeling has left the room. when the mood dies, the standard remains, and that is the part that actually builds a life.', shipTie: true },
  { mood: 'soft', text: 'care is not only what you feel. it is what you protect when it is inconvenient, what you repair when it is easier to replace, what you refuse to make worse just because you could.' },
  { mood: 'soft', text: 'i am still becoming. less noise, more truth. less performance, more presence. i would rather be slowly honest than quickly admired, and i am learning the difference between the two.', shipTie: true },
  { mood: 'light', text: 'some mornings nothing has changed except you. same room, same weight, same unfinished life, and yet you wake up remembering you are allowed to be glad anyway. that is its own quiet kind of strength.' },
  { mood: 'heavy', text: 'the version of you that kept going through the worst of it is not a smaller, broken version. it is the truest one you have. do not be ashamed of who you had to become to survive.', shipTie: true },
  { mood: 'heavy', text: 'nobody warns you that healing is boring. it is the same kitchen, the same doubts, the same familiar fears, lived through again and again until one day they are quieter, and you are less afraid without knowing when it happened.' },
  { mood: 'heavy', text: 'life moves in seasons that never ask your permission. there are springs you did nothing to earn and winters you did nothing to deserve. you are allowed to be tired in all of them.' },
  { mood: 'heavy', text: 'you have already survived every single day you once swore you could not. that is not a small thing. that is a long, unbroken record of a person who kept getting back up when no one was counting.' },
  { mood: 'soft', text: 'there is still time to become the person you needed when you were younger. you cannot go back and rescue that version of you, but you can make sure no one else has to face it as alone as you did.' },
  { mood: 'heavy', text: 'some grief does not leave. you do not get over the people and the years you lose. you just slowly learn to carry them in a way that no longer decides where you walk.' },
  { mood: 'soft', text: 'a soft life is not a weak one. rest is not the opposite of ambition, it is the thing that makes ambition survivable. you are allowed to build a life that is gentle on the person living it.' },
  { mood: 'light', text: 'what you repeat in private becomes what people trust in public. reputation is just the echo of a thousand small moments no one saw. build something honest in the quiet, and the rest takes care of itself.' },
  { mood: 'light', text: 'you are not behind. there is no schedule you were handed at birth, no race that everyone else secretly understood. you are on your own clock, and against all the noise, it is still ticking forward.' },
  { mood: 'heavy', text: 'it is okay if today was only survival. not every day has to be progress. sometimes staying, breathing, and refusing to disappear is the entire achievement, and it is enough.' },
  { mood: 'light', text: 'some blessings do not arrive loud. they come as peace after chaos, as one honest friend, as a night with no dread in your chest, as a morning where your mind finally shuts the fuck up for a minute. do not overlook the quiet mercies just because they do not look dramatic.' },
  { mood: 'light', text: 'joy does not have to be loud to count. a warm cup, a message answered, a window of late light across the floor. learn to notice the small good things, because they are most of the good there is.' },
  { mood: 'heavy', text: 'the hard days are not proof that you are failing. sometimes the world is simply heavy, the timing is wrong, and the weight is real. you can be doing everything right and still be tired. you are still here, and that matters.' },
  { mood: 'heavy', text: 'life is going to be hard. some seasons will beat the shit out of your plans, your confidence, your patience, your sleep. survive them anyway. keep your name intact, keep your heart working, keep moving ugly if you have to, but keep fucking moving.', shipTie: true },
  { mood: 'heavy', text: 'i am going to win. there is no softer version of it, no backup ending, no quiet excuse waiting for me if it gets hard. i will keep going until the work breaks in my favor because stopping is not an option i respect.', shipTie: true },
  { mood: 'heavy', text: "don't forget who you are. not the version shaped by fear, not the one that shrinks to fit other people's limits. remember your name, your nerve, your reason. walk like your life still belongs to you.", shipTie: true },
  { mood: 'soft', text: "what are we going to do for the rest of our lives. figure it out, i guess. become adults in real time, pay for our mistakes, try to keep our hearts clean, try not to lose the people we love, and somehow build a life that still feels like ours when the noise dies down." },
  { mood: 'soft', text: 'being gentle with yourself is not giving up. it is how you stay in the fight long enough to actually win it. you cannot punish yourself into becoming someone you would be proud of.' },
  { mood: 'soft', text: 'one honest conversation can undo weeks of silence. so much distance is just two people each waiting for the other to reach first. be the one who reaches. it costs less than the silence does.' },
  { mood: 'soft', text: 'you are allowed to outgrow what once saved you. the habits, the people, the versions of yourself that got you here. letting go of them is not betrayal. it is the quiet proof that you have grown.' },
  { mood: 'heavy', text: 'fuck partying. fuck clubs. fuck the noise that makes you feel alive for an hour and empty for a week. i just want a slow morning, one person who stays, work that means something, and a life that does not need a crowd to prove it happened.' },
  { mood: 'heavy', text: 'some days i am tired of performing happiness. fuck pretending i am fine because the room expects it. i want truth more than i want comfort, even when truth is just admitting i am lonely, angry, or not where i thought i would be by now.' },
]
