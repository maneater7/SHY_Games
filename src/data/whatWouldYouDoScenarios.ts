export type Mood = "neutral" | "pressuring" | "concerned" | "pleased" | "thoughtful" | "surprised" | "uneasy";

export type SceneId =
  | "park"
  | "school-fair"
  | "gaming-chat"
  | "cafe"
  | "social-feed"
  | "mall"
  | "clinic-reception"
  | "dusk-bench"
  | "clinic-counter"
  | "late-night-chat";

export interface ScenarioOption {
  id: string;
  text: string;
  isBest: boolean;
  outcome: { mood: Mood; text: string };
  whyNot?: string;
}

export interface Scenario {
  id: string;
  topic: string;
  scene: SceneId;
  speaker: { name: string; relation: string; line: string };
  startMood: Mood;
  situation: string;
  options: ScenarioOption[];
  explanation: string;
  takeaway: string;
  showSupportPanel?: boolean;
}

export const scenarios: Scenario[] = [
  {
    id: "s1",
    topic: "Peer pressure",
    scene: "park",
    speaker: { name: "Zack", relation: "your friend", line: "Come on, everyone’s doing it. Don’t be a buzzkill." },
    startMood: "pressuring",
    situation:
      "You’re with a group of friends. They encourage you to do something that makes you uncomfortable and say everyone else is doing it.",
    options: [
      {
        id: "s1-a",
        text: "Join in this once so they don’t think you’re boring, and say no next time.",
        isBest: false,
        outcome: { mood: "pleased", text: "Joining in to avoid pressure can make it harder to say no later." },
        whyNot: "“Just this once” has a way of turning into every time.",
      },
      {
        id: "s1-b",
        text: "Stay quiet and hang back, hoping they won’t notice you’re not taking part.",
        isBest: false,
        outcome: { mood: "neutral", text: "Staying quiet avoids the moment, but your boundary stays unclear." },
        whyNot: "Hanging back dodges the moment without saying what you need.",
      },
      {
        id: "s1-c",
        text: "Say you’re not comfortable and won’t join in, even if everyone else is. You could suggest something else to do instead.",
        isBest: true,
        outcome: { mood: "thoughtful", text: "You make your own call and set a clear boundary without putting anyone down." },
      },
    ],
    explanation:
      "You have the right to make your own decisions, even when others disagree. You don’t have to join in to fit in.",
    takeaway: "You don’t have to give up your boundaries to fit in.",
  },
  {
    id: "s2",
    topic: "Personal boundaries",
    scene: "school-fair",
    speaker: { name: "Danial", relation: "someone you know", line: "Hey! Haven’t seen you in ages. Come here, give me a hug!" },
    startMood: "pleased",
    situation: "Someone you know keeps trying to hug you even after you’ve said you don’t like being touched.",
    options: [
      {
        id: "s2-a",
        text: "Say clearly that you don’t want to be touched like this. If it keeps happening, tell a trusted adult, like a parent, teacher or school counsellor.",
        isBest: true,
        outcome: { mood: "surprised", text: "You state your boundary out loud, and you know where to go if it’s ignored." },
      },
      {
        id: "s2-b",
        text: "Step away each time without saying anything, so you don’t hurt their feelings.",
        isBest: false,
        outcome: { mood: "neutral", text: "They may not get the message, so it’s likely to keep happening." },
        whyNot: "Stepping away without a word leaves the message unclear.",
      },
      {
        id: "s2-c",
        text: "Let it go, because they know you and probably mean well.",
        isBest: false,
        outcome: { mood: "pleased", text: "Meaning well doesn’t cancel your right to feel comfortable." },
        whyNot: "It puts their feelings ahead of your comfort.",
      },
    ],
    explanation:
      "Everyone has the right to personal boundaries, whoever the other person is. Say it clearly, and get support if it continues.",
    takeaway: "Your boundaries count, even with people you know.",
  },
  {
    id: "s3",
    topic: "Online privacy",
    scene: "gaming-chat",
    speaker: { name: "Ghost99", relation: "someone you met online", line: "If you won’t even tell me where you live, why are we even talking?" },
    startMood: "pressuring",
    situation:
      "Someone you’ve been chatting with online asks you to share private information and says they’ll stop talking to you if you refuse.",
    options: [
      {
        id: "s3-a",
        text: "Give them a little information so they stay interested, but not all of it.",
        isBest: false,
        outcome: { mood: "pleased", text: "Even a little information gives them something to keep pushing for more." },
        whyNot: "Giving a little is still giving in, and the pressure rarely stops there.",
      },
      {
        id: "s3-b",
        text: "Refuse, even if they stop talking to you. If they keep pressuring or threaten you, keep the messages, block them and tell a trusted adult.",
        isBest: true,
        outcome: { mood: "surprised", text: "You protect your privacy and keep a record in case you need help later." },
      },
      {
        id: "s3-c",
        text: "Share it, but ask them not to tell anyone.",
        isBest: false,
        outcome: { mood: "pleased", text: "Once it’s shared, a promise can’t control where it goes." },
        whyNot: "You can’t control what happens to information once it’s shared.",
      },
    ],
    explanation:
      "Personal information should never be shared under pressure. Protecting your privacy and getting trusted support are the right responses.",
    takeaway: "Pressure is a reason to share less, not more.",
  },
  {
    id: "s4",
    topic: "Relationship pressure",
    scene: "cafe",
    speaker: { name: "Ryan", relation: "someone close to you", line: "If you really cared about me, you wouldn’t need more time." },
    startMood: "concerned",
    situation:
      "Someone close to you keeps pressuring you to make a decision you’re not ready for. They say that if you cared about them, you’d agree.",
    options: [
      {
        id: "s4-a",
        text: "Agree for now so the argument ends, and talk about it again later.",
        isBest: false,
        outcome: { mood: "pleased", text: "The argument stops, but the decision wasn’t really yours." },
        whyNot: "Agreeing to end the argument is giving in to avoid conflict.",
      },
      {
        id: "s4-b",
        text: "Ask them to give you a deadline so you can decide by then.",
        isBest: false,
        outcome: { mood: "neutral", text: "Now there’s a countdown on a decision that should happen at your pace." },
        whyNot: "A deadline is just more pressure.",
      },
      {
        id: "s4-c",
        text: "Tell them you’re not ready and that you’ll decide when you are. If they keep pushing, talk to someone you trust.",
        isBest: true,
        outcome: { mood: "thoughtful", text: "You keep your own pace, and you’ve got backup if the pressure continues." },
      },
    ],
    explanation: "Care and affection should never be used to pressure someone. You can make decisions at your own pace.",
    takeaway: "Someone who cares about you will respect your pace.",
  },
  {
    id: "s5",
    topic: "Health misinformation",
    scene: "social-feed",
    speaker: { name: "@herbdoc", relation: "a post on your feed", line: "This home remedy cleared my STI in 3 days. Don’t waste money at the clinic!" },
    startMood: "pleased",
    situation:
      "You see a social media post claiming a home remedy can cure an STI. Several people in the comments say it worked for them.",
    options: [
      {
        id: "s5-a",
        text: "Check reliable medical sources and ask a healthcare professional, because online stories can’t tell you whether something works or is safe.",
        isBest: true,
        outcome: { mood: "surprised", text: "You go to people who can actually check what’s going on and treat it properly." },
      },
      {
        id: "s5-b",
        text: "Try it, but only if it seems safe, and stop if it doesn’t work.",
        isBest: false,
        outcome: { mood: "pleased", text: "While you wait to see if it works, real testing and treatment get pushed back." },
        whyNot: "Trying it first risks delaying real treatment.",
      },
      {
        id: "s5-c",
        text: "Message the commenters to ask exactly what they used.",
        isBest: false,
        outcome: { mood: "pleased", text: "You get more stories, but still no one who can actually examine you." },
        whyNot: "It’s more unverified advice from strangers.",
      },
    ],
    explanation: "Testimonials and home remedies are no substitute for evidence-based medical advice and proper treatment.",
    takeaway: "For health questions, go to a qualified professional, not the comments.",
  },
  {
    id: "s6",
    topic: "Witnessing harassment",
    scene: "mall",
    speaker: { name: "A stranger", relation: "talking to Aina", line: "Why are you ignoring me? Just give me your number." },
    startMood: "uneasy",
    situation:
      "In a public place, someone repeatedly makes unwanted sexual comments to another person who looks uncomfortable.",
    options: [
      {
        id: "s6-a",
        text: "Confront the person loudly in front of everyone, even if it doesn’t feel safe.",
        isBest: false,
        outcome: { mood: "concerned", text: "Things get louder and tenser, and now you might both be at risk." },
        whyNot: "It could put you at risk and make things escalate.",
      },
      {
        id: "s6-b",
        text: "If it’s safe, check in with the person (for example, “Are you okay?”) or stay near them, and tell a staff member or someone responsible.",
        isBest: true,
        outcome: { mood: "pleased", text: "Aina isn’t alone anymore, and someone who can step in now knows what’s happening." },
      },
      {
        id: "s6-c",
        text: "Say nothing at the time and talk about it with friends afterwards.",
        isBest: false,
        outcome: { mood: "uneasy", text: "Aina is left to deal with it alone, right when support would help most." },
        whyNot: "It leaves the person without help when it matters.",
      },
    ],
    explanation: "Bystanders can help discourage harassment. Think about your own safety and what the affected person wants.",
    takeaway: "Help in a way that keeps you and them safe.",
  },
  {
    id: "s7",
    topic: "Getting health advice",
    scene: "clinic-reception",
    speaker: { name: "Nurse Farah", relation: "at the clinic desk", line: "Hi! What can we help you with today?" },
    startMood: "neutral",
    situation:
      "You have a reproductive health concern that has bothered you for a while, but you’re not sure it’s serious enough for a clinic.",
    options: [
      {
        id: "s7-a",
        text: "Wait a few more weeks to see if it goes away by itself.",
        isBest: false,
        outcome: { mood: "concerned", text: "Weeks go by, and you keep worrying without any answers." },
        whyNot: "Waiting delays care.",
      },
      {
        id: "s7-b",
        text: "Search your symptoms online and treat whatever the websites suggest.",
        isBest: false,
        outcome: { mood: "neutral", text: "A search result can’t examine you, and the wrong treatment can make things worse." },
        whyNot: "It relies on unverified information.",
      },
      {
        id: "s7-c",
        text: "Book an appointment with a qualified healthcare professional and explain your concerns. You don’t have to be sure it’s serious to ask.",
        isBest: true,
        outcome: { mood: "pleased", text: "You get a proper check, and you can ask about confidentiality when you book." },
      },
    ],
    explanation:
      "Healthcare professionals can assess concerns and recommend care. You don’t need to diagnose yourself first, and you can ask about confidentiality when you book.",
    takeaway: "You don’t need to be sure it’s serious before asking for help.",
  },
  {
    id: "s8",
    topic: "Unsafe secrets",
    scene: "dusk-bench",
    speaker: { name: "Maya", relation: "your friend", line: "Please don’t tell anyone. Promise me." },
    startMood: "concerned",
    situation:
      "Someone tells you they’re being pressured into an uncomfortable situation but asks you not to tell anyone, even though they may be unsafe.",
    options: [
      {
        id: "s8-a",
        text: "Listen without judging and thank them for telling you. Explain you can’t promise to keep it secret if they might be unsafe, and encourage them to talk to a trusted adult. Offer to go with them.",
        isBest: true,
        outcome: { mood: "thoughtful", text: "Maya feels heard, and she knows she won’t have to face the next step alone." },
      },
      {
        id: "s8-b",
        text: "Promise to keep it secret now, then decide later whether to tell someone.",
        isBest: false,
        outcome: { mood: "uneasy", text: "The promise feels kind now, but it makes getting help harder if things get worse." },
        whyNot: "If you tell someone later, it breaks their trust, and it delays help now.",
      },
      {
        id: "s8-c",
        text: "Tell their friends so they can look out for them.",
        isBest: false,
        outcome: { mood: "concerned", text: "Maya’s private story spreads, and the people who hear it can’t actually keep her safe." },
        whyNot: "It spreads private information and may make things worse for them.",
      },
    ],
    explanation:
      "Respect their privacy, but don’t promise secrecy when someone’s safety may be at risk. Help them reach appropriate support. If someone is in immediate danger, call your local emergency number.",
    takeaway: "Safety matters more than keeping an unsafe secret.",
    showSupportPanel: true,
  },
  {
    id: "s9",
    topic: "Respectful healthcare",
    scene: "clinic-counter",
    speaker: { name: "Clinic staff", relation: "behind the counter", line: "Someone your age shouldn’t be asking about this." },
    startMood: "pressuring",
    situation:
      "You visit a healthcare facility to ask a sexual health question and feel the staff member is judging you because of your age.",
    options: [
      {
        id: "s9-a",
        text: "Accept it quietly. Staff know best, and speaking up could make things awkward.",
        isBest: false,
        outcome: { mood: "pressuring", text: "You leave without the answers or the respect you came for." },
        whyNot: "It means accepting poor treatment.",
      },
      {
        id: "s9-b",
        text: "Politely ask to speak with another qualified professional, or look for a youth-friendly service. You deserve respectful care.",
        isBest: true,
        outcome: { mood: "surprised", text: "You stand up for yourself and go looking for care that treats you with respect." },
      },
      {
        id: "s9-c",
        text: "Leave and decide never to seek health advice again.",
        isBest: false,
        outcome: { mood: "neutral", text: "One bad experience ends up costing you every future appointment." },
        whyNot: "You’d miss out on care you need.",
      },
    ],
    explanation:
      "Young people deserve respectful, non-judgemental healthcare. You can ask for another provider if you feel uncomfortable.",
    takeaway: "You deserve healthcare without judgement.",
  },
  {
    id: "s10",
    topic: "Meeting someone from online",
    scene: "late-night-chat",
    speaker: { name: "MysticX", relation: "someone you met online", line: "Let’s meet tonight, just us two. Don’t tell anyone, okay?" },
    startMood: "pleased",
    situation:
      "Someone you’ve been chatting with online for a few weeks asks to meet in person, just the two of you, and says not to tell anyone.",
    options: [
      {
        id: "s10-a",
        text: "Agree, but pick a busy café and keep it secret so they don’t get upset.",
        isBest: false,
        outcome: { mood: "pleased", text: "A busy place helps a little, but nobody who cares about you knows where you are." },
        whyNot: "It still goes along with the secrecy.",
      },
      {
        id: "s10-b",
        text: "Agree, but ask for a video call first to check they’re real.",
        isBest: false,
        outcome: { mood: "pleased", text: "A video call shows a face, not whether meeting in secret is safe." },
        whyNot: "It still goes along with the secrecy, and a video call doesn’t make an in-person meeting safe.",
      },
      {
        id: "s10-c",
        text: "Say no to meeting in secret, tell a trusted adult about the request, and don’t share your location.",
        isBest: true,
        outcome: { mood: "surprised", text: "You spot the warning sign and keep your location to yourself." },
      },
    ],
    explanation:
      "Being asked to keep a meeting secret is a warning sign. Telling a trusted adult is the safe step, and your location and school should stay private.",
    takeaway: "Secrecy is a warning sign. Tell someone you trust.",
    showSupportPanel: true,
  },
];
