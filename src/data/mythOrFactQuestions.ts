export type Answer = "myth" | "fact";

export interface Question {
  id: string;
  topic: string;
  statement: string;
  correctAnswer: Answer;
  explanation: string;
  correction: string;
  takeaway: string;
}

export const questions: Question[] = [
  {
    id: "q1",
    topic: "STIs without symptoms",
    statement:
      "A person can have a sexually transmitted infection (STI) without any symptoms.",
    correctAnswer: "fact",
    explanation:
      "Some STIs cause no symptoms, so you can’t tell your status from how you feel. Testing matters.",
    correction: "Feeling healthy doesn’t rule out an STI.",
    takeaway: "Some STIs have no symptoms.",
  },
  {
    id: "q2",
    topic: "Sharing food",
    statement:
      "You can get an STI just by sharing food or sitting beside someone.",
    correctAnswer: "myth",
    explanation:
      "STIs aren’t generally spread through ordinary contact like sharing meals or sitting together.",
    correction:
      "Believing this fuels stigma and makes people avoid someone with an STI.",
    takeaway: "Everyday contact doesn’t spread STIs.",
  },
  {
    id: "q3",
    topic: "STIs can’t be treated",
    statement: "Once you have an STI, nothing can be done about it.",
    correctAnswer: "myth",
    explanation:
      "Many STIs, like chlamydia, gonorrhoea and syphilis, can be cured. Others, like HIV and herpes, can’t be cured but can be managed. Early testing and treatment matter.",
    correction: "This belief can stop people from getting tested.",
    takeaway: "Many STIs can be cured or managed.",
  },
  {
    id: "q4",
    topic: "Condoms",
    statement:
      "Condoms can reduce the risk of many STIs when used correctly and consistently.",
    correctAnswer: "fact",
    explanation:
      "Condoms reduce the risk of many STIs and of unintended pregnancy, but don’t give complete protection against every infection.",
    correction:
      "Condoms work when used correctly, but no method is 100% for every infection.",
    takeaway: "Condoms reduce risk, not eliminate it.",
  },
  {
    id: "q5",
    topic: "Hygiene",
    statement: "Maintaining personal hygiene can prevent every STI.",
    correctAnswer: "myth",
    explanation:
      "Hygiene supports general health but can’t prevent all STIs. Prevention depends on the infection and on protective measures.",
    correction: "Hygiene doesn’t replace protection and testing.",
    takeaway: "Hygiene can’t prevent every STI.",
  },
  {
    id: "q6",
    topic: "The 28-day cycle",
    statement: "Menstrual cycles are exactly 28 days for everyone.",
    correctAnswer: "myth",
    explanation:
      "Cycle length varies between people and from month to month. Twenty-eight days is an average, not a rule.",
    correction: "A cycle that isn’t 28 days isn’t necessarily a problem.",
    takeaway: "28 days is an average, not a rule.",
  },
  {
    id: "q7",
    topic: "HPV vaccine",
    statement: "The HPV vaccine can help protect against certain cancers.",
    correctAnswer: "fact",
    explanation:
      "The vaccine protects against HPV types that can cause cervical and other cancers.",
    correction: "It targets the HPV types linked to several cancers.",
    takeaway: "The HPV vaccine helps prevent some cancers.",
  },
  {
    id: "q8",
    topic: "Contraception and STIs",
    statement: "All contraceptive methods protect against STIs.",
    correctAnswer: "myth",
    explanation:
      "Most contraception prevents pregnancy but doesn’t protect against STIs. Condoms can reduce the risk of many STIs.",
    correction: "Preventing pregnancy and preventing STIs are different goals.",
    takeaway: "Most contraception doesn’t protect against STIs.",
  },
  {
    id: "q9",
    topic: "Testing when you feel healthy",
    statement:
      "A person should consider STI testing when a healthcare professional recommends it, even if they feel healthy.",
    correctAnswer: "fact",
    explanation:
      "Some STIs have no symptoms. Testing recommendations depend on individual circumstances and possible exposure.",
    correction: "“I feel fine” is not a reliable test.",
    takeaway: "Feeling fine isn’t a reliable test.",
  },
  {
    id: "q10",
    topic: "Changing your mind",
    statement: "If someone said yes before, they can’t change their mind.",
    correctAnswer: "myth",
    explanation:
      "Consent can be withdrawn at any time, even after agreeing earlier or partway through. Everyone can change their mind.",
    correction: "Past agreement never removes someone’s right to say no now.",
    takeaway: "Consent can be withdrawn at any time.",
  },
  {
    id: "q11",
    topic: "Menstrual products",
    statement:
      "Menstrual products should be changed regularly, following the instructions and individual needs.",
    correctAnswer: "fact",
    explanation:
      "Regular changing supports menstrual hygiene and helps prevent leakage and irritation. Follow the product’s instructions.",
    correction: "Regular changing is part of good menstrual hygiene.",
    takeaway: "Change products regularly as instructed.",
  },
  {
    id: "q12",
    topic: "Menstrual health",
    statement:
      "Menstrual health can give useful information about reproductive health.",
    correctAnswer: "fact",
    explanation:
      "Menstrual patterns can offer useful health information. Discuss significant changes or persistent concerns with a healthcare professional.",
    correction:
      "Tracking your cycle can help you notice changes worth raising with a professional.",
    takeaway: "Menstrual patterns are useful health information.",
  },
];
