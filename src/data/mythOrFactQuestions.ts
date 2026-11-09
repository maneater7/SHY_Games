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
      "A person can have a sexually transmitted infection (STI) without noticing any symptoms.",
    correctAnswer: "fact",
    explanation:
      "Some STIs cause no noticeable symptoms, so you cannot reliably tell your STI status from how you feel. Testing is important.",
    correction: "Feeling healthy does not rule out an STI.",
    takeaway: "Some STIs have no noticeable symptoms.",
  },
  {
    id: "q2",
    topic: "Sharing food",
    statement:
      "You can get an STI simply by sharing food or sitting beside someone.",
    correctAnswer: "myth",
    explanation:
      "STIs are not generally spread through ordinary social contact such as sharing meals or sitting together. Transmission depends on the infection and how it spreads.",
    correction:
      "Believing that everyday contact spreads STIs can fuel stigma and cause people to avoid someone.",
    takeaway: "Everyday social contact does not generally spread STIs.",
  },
  {
    id: "q3",
    topic: "Treatment",
    statement: "Once you have an STI, nothing can be done about it.",
    correctAnswer: "myth",
    explanation:
      "Many STIs can be cured with treatment. Others cannot be cured but can be managed with medical care. Testing and treatment advice should come from a qualified health professional.",
    correction:
      "This belief can stop people from seeking testing and care. Many STIs can be treated, and others can be managed.",
    takeaway: "Many STIs can be treated, and others can be managed with care.",
  },
  {
    id: "q4",
    topic: "Condoms",
    statement:
      "Condoms can reduce the risk of many STIs when used correctly and consistently.",
    correctAnswer: "fact",
    explanation:
      "Condoms reduce the risk of many STIs and unintended pregnancy, although they do not give complete protection against every infection.",
    correction:
      "Condoms can reduce the risk of many STIs when used correctly, but no method protects against every infection.",
    takeaway: "Condoms reduce risk, but do not provide complete protection from every STI.",
  },
  {
    id: "q5",
    topic: "Hygiene",
    statement:
      "Maintaining personal hygiene can prevent every sexually transmitted infection.",
    correctAnswer: "myth",
    explanation:
      "Good hygiene supports general health, but it cannot prevent all STIs. Prevention depends on the infection and on appropriate protective measures.",
    correction:
      "Hygiene supports general health, but it does not replace appropriate prevention or testing.",
    takeaway: "Good hygiene cannot prevent every STI.",
  },
  {
    id: "q6",
    topic: "Menstrual cycles",
    statement: "Menstrual cycles are exactly 28 days long for everyone.",
    correctAnswer: "myth",
    explanation:
      "Cycle length varies between people and can change from month to month. Twenty-eight days is an average, not a rule.",
    correction:
      "A cycle that differs from 28 days is not necessarily a problem.",
    takeaway: "Menstrual cycle length varies between people.",
  },
  {
    id: "q7",
    topic: "HPV vaccine",
    statement:
      "The HPV vaccine can help protect against certain types of cancer.",
    correctAnswer: "fact",
    explanation:
      "HPV vaccination protects against certain HPV types that can cause cervical and other cancers.",
    correction:
      "The vaccine protects against certain HPV types linked to several cancers.",
    takeaway: "The HPV vaccine helps protect against some cancer-causing HPV types.",
  },
  {
    id: "q8",
    topic: "Contraception and STIs",
    statement:
      "All contraceptive methods protect against sexually transmitted infections.",
    correctAnswer: "myth",
    explanation:
      "Most contraceptive methods prevent pregnancy but do not protect against STIs. Condoms can reduce the risk of many STIs.",
    correction:
      "Preventing pregnancy and reducing the risk of STIs are different goals.",
    takeaway: "Most contraception does not protect against STIs.",
  },
  {
    id: "q9",
    topic: "Testing when you feel healthy",
    statement:
      "A person should consider STI testing when a healthcare professional recommends it, even if they feel completely healthy.",
    correctAnswer: "fact",
    explanation:
      "Some STIs have no noticeable symptoms. Testing recommendations depend on individual circumstances and possible exposure.",
    correction:
      "Feeling fine is not a reliable test. Follow advice from a qualified healthcare professional.",
    takeaway: "A person can feel healthy and still need a recommended test.",
  },
  {
    id: "q10",
    topic: "Changing your mind",
    statement:
      "If someone said yes to something before, they cannot change their mind.",
    correctAnswer: "myth",
    explanation:
      "Consent can be withdrawn at any time, including after agreeing earlier or partway through. Everyone has the right to change their mind.",
    correction:
      "Past agreement never removes someone's right to say no now.",
    takeaway: "Consent can be changed or withdrawn at any time.",
  },
  {
    id: "q11",
    topic: "Menstrual products",
    statement:
      "Menstrual products should be changed regularly, following the product instructions and individual needs.",
    correctAnswer: "fact",
    explanation:
      "Changing products regularly supports menstrual hygiene and helps prevent leakage and irritation. Follow the product's instructions.",
    correction:
      "Regular changing is part of menstrual hygiene; follow the product instructions.",
    takeaway: "Follow menstrual product instructions and individual needs.",
  },
  {
    id: "q12",
    topic: "Menstrual health",
    statement:
      "Menstrual health can give useful information about a person's reproductive health.",
    correctAnswer: "fact",
    explanation:
      "Menstrual patterns can offer useful health information. Significant changes or persistent concerns should be discussed with a healthcare professional.",
    correction:
      "Noticing changes in menstrual patterns can help someone decide what to discuss with a health professional.",
    takeaway:
      "Menstrual patterns can be useful health information; persistent concerns deserve professional advice.",
  },
];
