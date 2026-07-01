export interface PresetQuestion {
  text: string;
  subtheme: string;
}

export const PRESET_QUESTIONS: Record<string, PresetQuestion[]> = {
  work: [
    { subtheme: 'FUN FACT',         text: "What's a fun fact about yourself that surprises people at work?" },
    { subtheme: 'FUN FACT',         text: "What's something you're weirdly good at that has nothing to do with your job?" },
    { subtheme: 'FIRSTS',           text: "What was your very first job, and what did it teach you?" },
    { subtheme: 'FIRSTS',           text: "What's the first thing you do every morning before opening your laptop?" },
    { subtheme: 'SMALL OBSESSIONS', text: "What's one tool, app, or gadget you couldn't work without?" },
    { subtheme: 'SMALL OBSESSIONS', text: "What's a work habit or ritual you're low-key obsessed with?" },
    { subtheme: 'USELESS SKILLS',   text: "What's a skill you have that serves absolutely no professional purpose?" },
    { subtheme: 'USELESS SKILLS',   text: "What's the most niche thing you know how to do that nobody asked for?" },
  ],
  me: [
    { subtheme: 'SHADOW',    text: "What's a pattern in your life you keep repeating even though you know better?" },
    { subtheme: 'SHADOW',    text: "What's something about yourself you've been avoiding looking at lately?" },
    { subtheme: 'ROOTS',     text: "What's one thing from your childhood that still shapes how you move through the world?" },
    { subtheme: 'ROOTS',     text: "What belief did you grow up with that you've since completely changed your mind on?" },
    { subtheme: 'PRESENT',   text: "How are you actually doing right now — not the version you tell people?" },
    { subtheme: 'PRESENT',   text: "What's taking up the most mental space in your head this week?" },
    { subtheme: 'FUTURE',    text: "What's one thing you want to let go of before the end of the year?" },
    { subtheme: 'FUTURE',    text: "If your life had a theme song for where you're headed, what would it be?" },
  ],
  friends: [
    { subtheme: 'TRUTH',        text: "What's something you've never told anyone but could say right now?" },
    { subtheme: 'TRUTH',        text: "What's a lie you told that somehow made your life better?" },
    { subtheme: 'DARE',         text: "Text the last person you thought about today — right now, no explanation." },
    { subtheme: 'DARE',         text: "Say one genuine compliment out loud to the person on your left." },
    { subtheme: 'STORIES',      text: "Tell me about the time you almost got caught doing something you shouldn't have." },
    { subtheme: 'STORIES',      text: "What's the most chaotic thing that's happened to you in the last 12 months?" },
    { subtheme: 'HYPOTHETICALS', text: "If you had to survive a zombie apocalypse with the last 3 people you texted, how screwed are you?" },
    { subtheme: 'HYPOTHETICALS', text: "You can only eat one cuisine for the rest of your life — which one, and why?" },
  ],
  love: [
    { subtheme: 'MEMORY LANE',  text: "What's the first moment you knew something was different about this person?" },
    { subtheme: 'MEMORY LANE',  text: "What's a small, random memory of us that you secretly love?" },
    { subtheme: 'FUTURE',       text: "What's something you want us to do together that we haven't done yet?" },
    { subtheme: 'FUTURE',       text: "Where do you see us in five years — and does that excite or scare you?" },
    { subtheme: 'APPRECIATION', text: "What's something I do that you never take for granted?" },
    { subtheme: 'APPRECIATION', text: "What's a quality in me that you wish I gave myself more credit for?" },
    { subtheme: 'CURIOSITIES',  text: "What's something you've always wanted to ask me but never have?" },
    { subtheme: 'CURIOSITIES',  text: "Is there something about me you feel like you still don't fully understand?" },
  ],
};
