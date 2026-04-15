export type TimelineItem = {
  period: string;
  chapter: string;
  title: string;
  description: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  note: string;
};

export type TrackItem = {
  title: string;
  year: string;
  description: string;
  inspiration: string;
  audioSrc?: string;
  embedUrl?: string;
};

export type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

// Replace the placeholders in this file with your father's real biography,
// timeline details, family photos, and music links or recordings.
export const tributeContent = {
  site: {
    name: "Mieszko Gorski",
    label: "Composer, Programmer, Father",
    heroHeadline: "A life composed with courage, discipline, and grace.",
    heroSubheadline:
      "Mieszko Gorski began in music, taught and led others, crossed continents to build a new life in America through programming, and now returns to composition with the depth of everything he has lived.",
    storyIntro:
      "A tribute to an artistic life shaped by reinvention, family, and the quiet discipline of making beautiful things.",
    primaryCta: {
      label: "Explore His Story",
      href: "#story",
    },
    secondaryCta: {
      label: "Listen to His Music",
      href: "/music",
    },
    heroHighlights: [
      "Trained as a composer",
      "Professor and orchestra leader",
      "Immigrant who reinvented himself",
      "Programmer who returned to music",
    ],
  },
  biography: {
    eyebrow: "Biography",
    title: "He learned first to compose music, and later to compose a life.",
    intro:
      "Trained in composition, Mieszko Gorski first entered the world through music: structure, intuition, patience, and the deep work of listening.",
    paragraphs: [
      "His formal music education began in Poland at the Gdansk Academy of Music, where he completed a Master in Music Theory and Composition, grounding his work in rigorous training and long-form discipline.",
      "He later expanded into software and systems by earning a Diploma in Computer Programming with Web Technology from The Cittone Institute in Edison, NJ (graduated September 2002) and by completing a MicroComputer System Technician certification at LaGuardia Community College in Long Island City, NY.",
      "Then life asked something different of him. In coming to America, he chose reinvention over certainty. He traded familiarity for possibility, and in doing so transformed the habits of a composer into the habits of a programmer: rigor, pattern, clarity, endurance, and craft.",
      "That second career was an act of love as much as ambition. It was work done to build a future, support a family, and create stability. Now, in retirement, music has returned not as nostalgia but as continuation. He composes again with the authority of someone who has lived both the artistic and technical life fully.",
    ],
    quote: "He carried structure in his mind whether the medium was harmony, code, or the life he built for his family.",
  },
  timeline: [
    {
      period: "Early years",
      chapter: "Origins",
      title: "Master in Music Theory and Composition",
      description:
        "Gdansk Academy of Music, Gdansk, Poland: advanced training in composition and music theory with a deep focus on structure, voice leading, and artistic interpretation.",
    },
    {
      period: "Early years",
      chapter: "Teaching",
      title: "College-level instruction and orchestra leadership",
      description:
        "He taught music and worked with orchestra settings, helping students and peers bring compositions from the page to collaborative performance.",
    },
    {
      period: "A new beginning",
      chapter: "Immigration",
      title: "Moved to America in search of possibility",
      description:
        "He chose uncertainty over comfort in order to build a better future, carrying talent, discipline, and responsibility across borders.",
    },
    {
      period: "Graduation: Sept 2002",
      chapter: "Education pivot",
      title: "Diploma in Computer Programming with Web Technology",
      description:
        "The Cittone Institute, Edison, NJ: completed a 4.0/4.0 diploma covering software programming fundamentals and web technology.",
    },
    {
      period: "Second career",
      chapter: "Reinvention",
      title: "Transitioned into programming",
      description:
        "He transformed musical discipline into technical craft, finding elegance in logic, systems, and the patient solving of difficult problems.",
    },
    {
      period: "Working life",
      chapter: "Craft",
      title: "Built a successful professional life in technology",
      description:
        "He created stability through software, showing that reinvention can be both practical and deeply dignified.",
    },
    {
      period: "Retirement",
      chapter: "Retirement",
      title: "Made space again for creativity",
      description:
        "After years of responsibility, he opened the door once more to the artistic voice that had always been part of him.",
    },
    {
      period: "Today",
      chapter: "Return",
      title: "Composing and making music again",
      description:
        "He now writes with the depth of a life fully lived, bringing together the composer, the builder, the teacher, and the father.",
    },
  ] satisfies TimelineItem[],
  // Replace these local SVG placeholders with real family photos in /public/photos when ready.
  gallery: [
    {
      src: "/placeholders/photo-1.svg",
      alt: "Placeholder for an early music portrait",
      caption: "At the beginning of the musical journey",
      note: "Replace with an early portrait, conservatory, or composition-era photograph.",
    },
    {
      src: "/placeholders/photo-2.svg",
      alt: "Placeholder for a teaching or orchestra image",
      caption: "Teaching, rehearsal, and leadership",
      note: "Replace with a professor photo, classroom image, or orchestra rehearsal moment.",
    },
    {
      src: "/placeholders/photo-3.svg",
      alt: "Placeholder for an immigration-era image",
      caption: "A new country and a new chapter",
      note: "Replace with a family photo, travel image, or a picture from the move to America.",
    },
    {
      src: "/placeholders/photo-4.svg",
      alt: "Placeholder for a programming-career image",
      caption: "Years of work, dedication, and building",
      note: "Replace with a portrait from his programming years or a work-life image.",
    },
    {
      src: "/placeholders/photo-5.svg",
      alt: "Placeholder for a retirement and music image",
      caption: "Music returns in retirement",
      note: "Replace with a current studio, piano, desk, or composing photograph.",
    },
  ] satisfies GalleryItem[],
  music: {
    eyebrow: "Current work",
    title: "In retirement, music is once again the center of the room.",
    intro:
      "This section is designed as the emotional centerpiece of the page: a place for recordings, notes, and the pieces that now carry his voice forward.",
    note:
      "Swap the placeholder .wav files below for real recordings, or add external streaming links in this data file with the optional embedUrl field.",
  },
  // Replace the audioSrc values with real .mp3 or .wav files in /public/audio,
  // or add embedUrl values for YouTube, SoundCloud, Bandcamp, or another music page.
  tracks: [
    {
      title: "Nocturne for a Second Beginning",
      year: "2026",
      description:
        "A reflective piano study about return, memory, and the quiet courage of beginning again after a life of responsibility.",
      inspiration: "Inspired by the conviction required to start a new chapter with grace.",
      audioSrc: "/audio/placeholder-nocturne.wav",
    },
    {
      title: "American Etude",
      year: "2026",
      description:
        "A more rhythmic and searching work that honors reinvention, work, migration, and the making of a new life.",
      inspiration: "Inspired by movement, problem-solving, and the architecture of sacrifice.",
      audioSrc: "/audio/placeholder-etude.wav",
    },
    {
      title: "Letters to the Orchestra",
      year: "2026",
      description:
        "A lyrical sketch shaped by teaching, rehearsal, and the memory of sound shared with other musicians in the room.",
      inspiration: "Inspired by the professor years and the long echo of collaborative music-making.",
      audioSrc: "/audio/placeholder-letters.wav",
    },
  ] satisfies TrackItem[],
  values: [
    {
      icon: "artist",
      title: "Artist",
      description:
        "He hears nuance, structure, emotion, and silence. Art was his first language and remains one of his truest ones.",
    },
    {
      icon: "teacher",
      title: "Teacher",
      description:
        "He turned knowledge into guidance, shaping others through patience, standards, and care.",
    },
    {
      icon: "builder",
      title: "Immigrant and builder",
      description:
        "He crossed borders and rebuilt from the ground up, choosing courage and possibility over certainty.",
    },
    {
      icon: "programmer",
      title: "Technology professional",
      description:
        "As a programmer and technology professional, he brought discipline, logic, and elegance to software, proving that creativity and analysis belong together.",
    },
    {
      icon: "father",
      title: "Father",
      description:
        "His family knows his legacy not only in achievements, but in steadiness, sacrifice, and the example he set every day.",
    },
  ] satisfies ValueItem[],
  legacy: {
    title: "A legacy measured not only by what he achieved, but by the worlds he made possible for others.",
    reflection:
      "His life shows that artistry and practicality do not compete. In the right hands, they deepen one another. Music gave him form, programming gave him a second chapter, and family gave both of them purpose.",
    familyMessage:
      "From our family: thank you for the discipline, imagination, sacrifice, and love that shaped our lives. Thank you for showing us that reinvention is possible, that work can be honorable, and that beauty can return in every season.",
    quote:
      "Art gave him his first language. Work gave him another. Love made both of them meaningful.",
    attribution: "A family reflection",
  },
} as const;

export const navigationItems = [
  { id: "home", label: "Home" },
  { id: "story", label: "Story" },
  { id: "timeline", label: "Timeline" },
  { id: "gallery", label: "Gallery" },
  { id: "values", label: "Values" },
  { id: "legacy", label: "Legacy" },
];
