export type Expression = "neutral" | "worried" | "upset" | "relieved" | "happy" | "thoughtful";

export interface AnswerOption {
  id: string;            // stable ID, never changes when options are shuffled
  text: string;
  isHelpful: boolean;    // the answer key travels with the option
  explanation: string;   // shown after this option is chosen
}

export interface Question {
  id: string;
  topic: string;
  startExpression: Expression;   // friend's face while the player reads the message
  friendMessage: string;
  summary: string;               // general feedback paragraph
  options: AnswerOption[];       // 3 options; shuffle at game start
  helpfulReaction: { expression: Expression; caption: string };
  showSupportPanel?: boolean;    // show the gentle support panel with this feedback
}

export const questions: Question[] = [
  {
    "id": "q1",
    "topic": "Reaching out",
    "startExpression": "worried",
    "friendMessage": "“Something happened yesterday, and I don’t know who I can talk to about it.”",
    "summary": "A supportive response acknowledges your friend’s feelings without judging, blaming, or pressuring them to share more than they are comfortable with.",
    "options": [
      {
        "id": "q1-a",
        "text": "That sounds serious. Tell me exactly what happened, and we’ll work out how to fix it together.",
        "isHelpful": false,
        "explanation": "This may make your friend feel pressured to share more than they are ready to."
      },
      {
        "id": "q1-b",
        "text": "Try not to dwell on it for now. Things usually feel a lot better after a good night’s sleep.",
        "isHelpful": false,
        "explanation": "This plays down their feelings and may leave them feeling unheard."
      },
      {
        "id": "q1-c",
        "text": "I’m sorry you’re dealing with something hard. I’m here to listen whenever you feel ready.",
        "isHelpful": true,
        "explanation": "This gives your friend space and lets them decide when they are ready to talk."
      }
    ],
    "helpfulReaction": {
      "expression": "relieved",
      "caption": "Relieved and reassured"
    }
  },
  {
    "id": "q2",
    "topic": "Nervous about a clinic visit",
    "startExpression": "worried",
    "friendMessage": "“I’m really nervous about visiting a clinic to ask questions about my sexual health.”",
    "summary": "Asking questions about sexual health is valid, even with no symptoms or immediate concerns. A healthcare professional can provide reliable information, and it is reasonable to ask about confidentiality and privacy.",
    "options": [
      {
        "id": "q2-a",
        "text": "Lots of people feel that way. You deserve accurate information, and you can ask how they protect your privacy before you go.",
        "isHelpful": true,
        "explanation": "This reassures your friend and gives them a practical way to feel more comfortable."
      },
      {
        "id": "q2-b",
        "text": "I get it, it’s awkward. Maybe wait until you’re sure there’s actually a problem, so you don’t waste their time.",
        "isHelpful": false,
        "explanation": "This may discourage someone from seeking information or care they are entitled to."
      },
      {
        "id": "q2-c",
        "text": "Try asking in an online forum first. You’ll get plenty of answers without anyone knowing it’s you, and no awkward appointment.",
        "isHelpful": false,
        "explanation": "This points to online advice that may be inaccurate."
      }
    ],
    "helpfulReaction": {
      "expression": "happy",
      "caption": "More confident and reassured"
    }
  },
  {
    "id": "q3",
    "topic": "Boundaries in a relationship",
    "startExpression": "upset",
    "friendMessage": "“My partner keeps getting upset whenever I say no to something I’m uncomfortable with.”",
    "summary": "Everyone has the right to set boundaries. A healthy relationship involves respecting those boundaries without pressure or guilt.",
    "options": [
      {
        "id": "q3-a",
        "text": "Relationships are all about give and take. Maybe say yes now and then, just to keep things calm between you.",
        "isHelpful": false,
        "explanation": "This suggests giving up a personal boundary to avoid conflict."
      },
      {
        "id": "q3-b",
        "text": "You’re allowed to say no. If it keeps happening, talk to someone you trust about how it makes you feel.",
        "isHelpful": true,
        "explanation": "This backs your friend’s right to say no and encourages support if the behaviour continues."
      },
      {
        "id": "q3-c",
        "text": "They’re probably just stressed. Try explaining it a different way so they don’t take it personally.",
        "isHelpful": false,
        "explanation": "This makes your friend responsible for managing their partner’s reaction."
      }
    ],
    "helpfulReaction": {
      "expression": "happy",
      "caption": "Validated and supported"
    }
  },
  {
    "id": "q4",
    "topic": "Private picture shared in a group chat",
    "startExpression": "upset",
    "friendMessage": "“Someone shared a private picture of another student in our group chat. Everyone’s talking about it.”",
    "summary": "Sharing someone’s private content without permission is a serious breach of privacy. It is important not to forward or spread it further, and to involve someone who can help, such as a lecturer, student support, or the platform’s report tool.",
    "options": [
      {
        "id": "q4-a",
        "text": "Let’s just leave the group chat and stay out of it. It’s not really our business anyway.",
        "isHelpful": false,
        "explanation": "This avoids the situation without helping the person affected."
      },
      {
        "id": "q4-b",
        "text": "Ask everyone to stop forwarding it. If they listen, then we don’t really need to involve anyone else in this.",
        "isHelpful": false,
        "explanation": "Asking people to stop is a good first step, but it doesn’t bring in someone who can help further."
      },
      {
        "id": "q4-c",
        "text": "Don’t forward it, it could hurt them badly. Let’s report it and tell a lecturer or student support.",
        "isHelpful": true,
        "explanation": "This protects the person’s privacy and encourages the right kind of action."
      }
    ],
    "helpfulReaction": {
      "expression": "relieved",
      "caption": "Appreciative and reassured"
    }
  },
  {
    "id": "q5",
    "topic": "Pressure to send private pictures",
    "startExpression": "worried",
    "friendMessage": "“Someone I’m talking to keeps asking me to send private pictures. They say it’s how I prove I trust them.”",
    "summary": "Nobody should be pressured into sharing private pictures. Trust does not require someone to give up their privacy or personal boundaries. Repeated pressure is a warning sign, and your friend deserves support.",
    "options": [
      {
        "id": "q5-a",
        "text": "You don’t have to send anything. Trust isn’t proven with pictures, and it’s okay to stop talking to them if they push.",
        "isHelpful": true,
        "explanation": "This reinforces consent, boundaries, and the right to say no."
      },
      {
        "id": "q5-b",
        "text": "If you really do trust them, it should be fine, as long as they promise they won’t show it to anyone else at all.",
        "isHelpful": false,
        "explanation": "This relies on a promise that cannot guarantee privacy."
      },
      {
        "id": "q5-c",
        "text": "Maybe send just one that doesn’t show your face. That way it can’t be traced back to you, so it should be totally safe.",
        "isHelpful": false,
        "explanation": "This gives a false sense of safety and ignores the pressure your friend is under."
      }
    ],
    "helpfulReaction": {
      "expression": "happy",
      "caption": "Empowered and supported"
    }
  },
  {
    "id": "q6",
    "topic": "Comments about appearance",
    "startExpression": "upset",
    "friendMessage": "“People in my class keep making comments about my appearance, and it’s starting to bother me.”",
    "summary": "Repeated unwanted comments about someone’s appearance can be hurtful and may amount to bullying. A supportive friend listens, validates their feelings, and offers help without forcing them to take a particular action.",
    "options": [
      {
        "id": "q6-a",
        "text": "Just laugh it off. They’ll stop once they see it doesn’t get to you, they only do it for a reaction.",
        "isHelpful": false,
        "explanation": "This encourages your friend to hide how they feel."
      },
      {
        "id": "q6-b",
        "text": "I’m sorry, you don’t deserve that. Do you want to talk about it, or think about who we could tell?",
        "isHelpful": true,
        "explanation": "This shows empathy and offers practical support without forcing a next step."
      },
      {
        "id": "q6-c",
        "text": "Ignore them and focus on your studies. People like that get bored eventually and move on.",
        "isHelpful": false,
        "explanation": "This dismisses the problem."
      }
    ],
    "helpfulReaction": {
      "expression": "relieved",
      "caption": "Comforted and understood"
    }
  },
  {
    "id": "q7",
    "topic": "Myth about spotting STIs",
    "startExpression": "thoughtful",
    "friendMessage": "“I saw a post saying you can tell if someone has an STI just by looking at them. Is that true?”",
    "summary": "Many sexually transmitted infections do not cause visible symptoms. A person’s appearance cannot reliably tell you whether they have an STI. Testing and trustworthy medical information are important.",
    "options": [
      {
        "id": "q7-a",
        "text": "Sometimes, if there are visible signs like sores or a rash, so it’s worth looking out for them before you get close.",
        "isHelpful": false,
        "explanation": "This suggests you can spot an STI by looking, which isn’t reliable."
      },
      {
        "id": "q7-b",
        "text": "It depends. People who look unwell or run-down are usually more likely to have one, so watch for that.",
        "isHelpful": false,
        "explanation": "This links appearance to infection, which isn’t a reliable guide."
      },
      {
        "id": "q7-c",
        "text": "Not really. Many STIs have no visible signs, so testing and reliable medical info matter more than looks.",
        "isHelpful": true,
        "explanation": "This corrects the myth and points to reliable information."
      }
    ],
    "helpfulReaction": {
      "expression": "happy",
      "caption": "Curious, then enlightened"
    }
  },
  {
    "id": "q8",
    "topic": "STI stigma",
    "startExpression": "worried",
    "friendMessage": "“Someone in our class found out they have an STI, and people are avoiding them.”",
    "summary": "Having an STI does not make someone less deserving of kindness or respect. Everyday contact, such as sitting together or sharing food, does not spread STIs. Stigma and misinformation can discourage people from seeking testing and treatment.",
    "options": [
      {
        "id": "q8-a",
        "text": "An STI doesn’t make someone less deserving of respect, and sharing food or sitting together doesn’t spread it. Let’s not gossip.",
        "isHelpful": true,
        "explanation": "This promotes accurate information and respectful treatment."
      },
      {
        "id": "q8-b",
        "text": "I get why they’re avoiding them. It’s probably better to be careful until we know more about it, just in case, you never know.",
        "isHelpful": false,
        "explanation": "This reinforces fear based on misinformation."
      },
      {
        "id": "q8-c",
        "text": "Maybe they should have kept it to themselves, then people wouldn’t be treating them differently now, and it would have stayed private.",
        "isHelpful": false,
        "explanation": "This hides health information rather than challenging the stigma."
      }
    ],
    "helpfulReaction": {
      "expression": "happy",
      "caption": "Appreciative and understanding"
    }
  },
  {
    "id": "q9",
    "topic": "Jokes and rumours about health",
    "startExpression": "upset",
    "friendMessage": "“Someone started a rumour in our class group chat that a classmate has an STI. Everyone’s joking about it. I don’t think it’s funny.”",
    "summary": "Someone’s health information is private. Spreading rumours or making jokes about it can cause harm, even when the information is untrue. A supportive response avoids joining in the gossip and respects the person’s privacy.",
    "options": [
      {
        "id": "q9-a",
        "text": "It’s probably just banter. I wouldn’t make it a big deal, people will forget about it soon enough, honestly.",
        "isHelpful": false,
        "explanation": "This treats hurtful behaviour as normal."
      },
      {
        "id": "q9-b",
        "text": "You’re right. Joking about someone’s health isn’t okay, and we can’t even know if it’s true. Let’s not join in.",
        "isHelpful": true,
        "explanation": "This protects privacy and discourages the spread of rumours."
      },
      {
        "id": "q9-c",
        "text": "Message the classmate privately and ask if it’s true, so we at least know what’s really going on with them.",
        "isHelpful": false,
        "explanation": "This puts the classmate in an uncomfortable position and feeds the speculation."
      }
    ],
    "helpfulReaction": {
      "expression": "relieved",
      "caption": "Relieved that someone understands"
    }
  },
  {
    "id": "q10",
    "topic": "Feeling isolated",
    "startExpression": "worried",
    "friendMessage": "“I feel like everyone has someone to talk to except me. I don’t think anyone would notice if I stopped joining in.”",
    "summary": "A supportive friend takes feelings of isolation seriously, listens without dismissing them, and encourages the person to connect with other trusted people too. One friend should not be expected to be someone’s only source of support.",
    "options": [
      {
        "id": "q10-a",
        "text": "You’re not alone, you’ve got me! You don’t need anyone else, we can just stick together from now on.",
        "isHelpful": false,
        "explanation": "Well meant, but it may discourage your friend from building a wider circle of support."
      },
      {
        "id": "q10-b",
        "text": "Everyone feels like that sometimes. It always passes, you just have to give it a bit of time and be patient.",
        "isHelpful": false,
        "explanation": "This brushes aside how they feel."
      },
      {
        "id": "q10-c",
        "text": "That sounds lonely, and I’m glad you told me. Want to talk, or think about who else could be there for you?",
        "isHelpful": true,
        "explanation": "This acknowledges their feelings and gently encourages other support too."
      }
    ],
    "helpfulReaction": {
      "expression": "relieved",
      "caption": "Comforted and less alone"
    },
    "showSupportPanel": true
  }
];
