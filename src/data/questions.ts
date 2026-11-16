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
    "summary": "A supportive reply acknowledges feelings without judging, blaming or pressuring them to share more than they want to.",
    "options": [
      {
        "id": "q1-a",
        "text": "That sounds serious. Tell me exactly what happened so I can help.",
        "isHelpful": false,
        "explanation": "This pressures them for details they may not be ready to share."
      },
      {
        "id": "q1-b",
        "text": "Try not to dwell on it. Things usually feel better after a good night’s sleep.",
        "isHelpful": false,
        "explanation": "This minimises the problem, so they may stop reaching out."
      },
      {
        "id": "q1-c",
        "text": "I’m sorry you’re dealing with something hard. I’m here to listen whenever you feel ready.",
        "isHelpful": true,
        "explanation": "This gives them space and lets them decide when to talk."
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
    "summary": "Asking about your health is valid, and professionals are there to help without judging. Asking about confidentiality is a good first step.",
    "options": [
      {
        "id": "q2-a",
        "text": "Lots of people feel nervous about that. You deserve accurate information, and you can ask the clinic how they protect your privacy.",
        "isHelpful": true,
        "explanation": "This validates the feeling and suggests a practical first step."
      },
      {
        "id": "q2-b",
        "text": "I get it, it’s awkward. Maybe wait until you’re sure there’s a problem, so you don’t waste their time.",
        "isHelpful": false,
        "explanation": "This delays care and suggests the question isn’t worth asking."
      },
      {
        "id": "q2-c",
        "text": "Try asking in an online forum first. You’ll get plenty of answers without anyone knowing it’s you.",
        "isHelpful": false,
        "explanation": "This relies on unverified sources instead of reliable information."
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
    "summary": "Boundaries should be respected, and nobody should feel pressured.",
    "options": [
      {
        "id": "q3-a",
        "text": "Relationships are give and take. Maybe say yes sometimes to keep things calm.",
        "isHelpful": false,
        "explanation": "This treats giving up your boundaries as compromise."
      },
      {
        "id": "q3-b",
        "text": "You’re allowed to say no. If it keeps happening, talk to someone you trust about how it makes you feel.",
        "isHelpful": true,
        "explanation": "This backs your friend’s right to say no and points to support."
      },
      {
        "id": "q3-c",
        "text": "They’re probably just stressed. Try explaining it differently so they don’t take it personally.",
        "isHelpful": false,
        "explanation": "This makes your friend responsible for how the other person reacts."
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
    "summary": "Respect privacy, don’t forward private content, and get support. The person affected may need help.",
    "options": [
      {
        "id": "q4-a",
        "text": "Let’s just leave the chat and stay out of it. It’s not our business.",
        "isHelpful": false,
        "explanation": "This leaves the affected student without help."
      },
      {
        "id": "q4-b",
        "text": "Ask everyone to stop forwarding it, and if they do, we don’t need to tell anyone.",
        "isHelpful": false,
        "explanation": "This asks for the right thing but doesn’t involve anyone who can help."
      },
      {
        "id": "q4-c",
        "text": "Don’t share or forward it. It could hurt them badly. Let’s report it and tell a trusted adult.",
        "isHelpful": true,
        "explanation": "This protects privacy and brings in support."
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
    "summary": "Nobody should be pressured to share private images. You can’t control where an image goes, and the pressure itself is a warning sign.",
    "options": [
      {
        "id": "q5-a",
        "text": "You don’t have to send anything. Trust doesn’t mean sending private pictures, and it’s okay to stop talking to them if they keep pushing.",
        "isHelpful": true,
        "explanation": "This reinforces boundaries and names the pressure."
      },
      {
        "id": "q5-b",
        "text": "If you do trust them, it should be fine, as long as they promise not to share it.",
        "isHelpful": false,
        "explanation": "This relies on a promise nobody can enforce."
      },
      {
        "id": "q5-c",
        "text": "Send one that doesn’t show your face. That way it can’t be traced back to you.",
        "isHelpful": false,
        "explanation": "This still leaves the image open to being shared and ignores the pressure."
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
    "summary": "Respond with empathy, not dismissal. Repeated comments about someone’s body are bullying and may need adult support.",
    "options": [
      {
        "id": "q6-a",
        "text": "Just laugh it off. They’ll stop when they see it doesn’t get to you.",
        "isHelpful": false,
        "explanation": "This tells your friend to hide how they feel and carry on alone."
      },
      {
        "id": "q6-b",
        "text": "I’m sorry they’re saying that. You don’t deserve that. Do you want to talk, or think about who we could tell?",
        "isHelpful": true,
        "explanation": "This validates their feelings and offers support."
      },
      {
        "id": "q6-c",
        "text": "Ignore them and focus on your studies. They’ll get bored eventually.",
        "isHelpful": false,
        "explanation": "This also tells your friend to carry on alone."
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
    "summary": "Appearance can’t show whether someone has an STI. Reliable information and testing matter.",
    "options": [
      {
        "id": "q7-a",
        "text": "Sometimes, if there are visible signs, so it’s worth looking out for them.",
        "isHelpful": false,
        "explanation": "This relies on appearance, but many people with an STI look and feel healthy."
      },
      {
        "id": "q7-b",
        "text": "It depends. People who look unwell are more likely to have one.",
        "isHelpful": false,
        "explanation": "This also relies on appearance, which isn’t a reliable guide."
      },
      {
        "id": "q7-c",
        "text": "Not really. Many STIs have no visible signs, so you can’t tell by looking. Testing and reliable info are what count.",
        "isHelpful": true,
        "explanation": "This corrects the myth and points to testing."
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
    "summary": "STI stigma can stop people from getting tested and treated. Everyone deserves respect.",
    "options": [
      {
        "id": "q8-a",
        "text": "Having an STI doesn’t make someone less deserving of respect. Sitting together or sharing food doesn’t spread STIs, so let’s not avoid them or gossip.",
        "isHelpful": true,
        "explanation": "This challenges stigma with facts."
      },
      {
        "id": "q8-b",
        "text": "I get why they’re avoiding them. It’s better to be careful until we know more.",
        "isHelpful": false,
        "explanation": "This is fear based on misinformation."
      },
      {
        "id": "q8-c",
        "text": "Maybe they should keep it to themselves so people don’t treat them differently.",
        "isHelpful": false,
        "explanation": "This tells the person to hide instead of challenging the stigma."
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
    "summary": "Treat private health information with respect. Don’t spread rumours you can’t verify or normalise humiliation.",
    "options": [
      {
        "id": "q9-a",
        "text": "It’s probably just banter. Don’t make it a big deal.",
        "isHelpful": false,
        "explanation": "This normalises bullying."
      },
      {
        "id": "q9-b",
        "text": "You’re right. Joking about someone’s private health isn’t okay, and we can’t even know if it’s true. Let’s not join in.",
        "isHelpful": true,
        "explanation": "This respects privacy and refuses the rumour."
      },
      {
        "id": "q9-c",
        "text": "Message the classmate privately and ask if it’s true, so we know what’s going on.",
        "isHelpful": false,
        "explanation": "This feeds curiosity at the classmate’s expense and puts them on the spot."
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
    "summary": "Acknowledge the feeling, and encourage connection with other trusted people. If a friend seems hopeless or unsafe, encourage them to talk to a trusted adult or counsellor.",
    "options": [
      {
        "id": "q10-a",
        "text": "You’re not alone, you’ve got me! You don’t need anyone else.",
        "isHelpful": false,
        "explanation": "Well meant, but this discourages wider support."
      },
      {
        "id": "q10-b",
        "text": "Everyone feels like that sometimes. It passes, just give it time.",
        "isHelpful": false,
        "explanation": "This dismisses the feeling."
      },
      {
        "id": "q10-c",
        "text": "That sounds lonely, and I’m glad you told me. Would you like to talk, or think about someone else you trust too?",
        "isHelpful": true,
        "explanation": "This acknowledges the feeling and opens the door to more support."
      }
    ],
    "helpfulReaction": {
      "expression": "relieved",
      "caption": "Comforted and less alone"
    },
    "showSupportPanel": true
  }
];
