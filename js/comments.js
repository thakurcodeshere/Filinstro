// ── Comment Classifier Engine ──

const CATEGORIES = {
  hate: {
    label: 'Hate', icon: '🔴', class: 'badge-hate',
    keywords: ['hate','disgusting','ugly','terrible','awful','worst','pathetic','loser','trash','garbage',
      'stupid','idiot','dumb','horrible','nasty','worthless','failure','embarrassing','cringe','garbage content']
  },
  comic: {
    label: 'Comic', icon: '😂', class: 'badge-comic',
    keywords: ['lol','lmao','haha','funny','hilarious','rofl','joke','comedy','laughing','😂','🤣','💀',
      'dead','screaming','no way','omg','bruh','ded','im done','im crying','💀💀']
  },
  abuse: {
    label: 'Abuse', icon: '⚠️', class: 'badge-abuse',
    keywords: ['kill','die','hurt','harm','attack','threat','f***','sh**','b****','damn',
      'curse','bully','harass','violent','destroy','revenge','burn','suffer','shut up','go away']
  },
  praise: {
    label: 'Praise', icon: '🌟', class: 'badge-praise',
    keywords: ['amazing','great','love','beautiful','wonderful','fantastic','excellent','awesome','brilliant',
      'stunning','gorgeous','perfect','best','incredible','outstanding','superb','phenomenal','wow','fire','🔥',
      'goat','legend','queen','king','banger','elite','next level','loved it','obsessed']
  },
  appreciate: {
    label: 'Appreciate', icon: '💚', class: 'badge-appreciate',
    keywords: ['thank','thanks','appreciate','grateful','helpful','useful','inspired','motivated',
      'keep it up','well done','great work','keep going','this helped','learned','saved me','needed this',
      'just what','been waiting','so helpful','informative','valuable','means a lot']
  },
  politics: {
    label: 'Politics', icon: '🏛️', class: 'badge-politics',
    keywords: ['government','political','election','vote','party','minister','president','policy',
      'democracy','rights','law','corrupt','protest','opposition','parliament','congress',
      'liberal','conservative','left wing','right wing','agenda','propaganda','freedom','taxes','regime']
  },
  education: {
    label: 'Education', icon: '📚', class: 'badge-education',
    keywords: ['learn','school','university','study','knowledge','teach','lesson','course',
      'tutorial','educational','lecture','research','exam','degree','student','professor',
      'academic','curriculum','training','workshop','skill','certificate','reading','homework']
  },
  tech: {
    label: 'Tech', icon: '💻', class: 'badge-tech',
    keywords: ['app','software','phone','laptop','gadget','code','coding','AI','artificial intelligence',
      'update','device','technology','algorithm','data','machine learning','developer','github',
      'api','startup','innovation','digital','android','ios','cloud','server','program','feature']
  },
  sarcasm: {
    label: 'Sarcasm', icon: '😏', class: 'badge-sarcasm',
    keywords: ['yeah right','sure','totally','oh really','great job','as if','obviously','clearly',
      'must be nice','wow really','so original','never seen that before','shocking','what a surprise',
      'of course','absolutely not','sure sure','right right','no way really','how unexpected','groundbreaking']
  },
  spam: {
    label: 'Spam', icon: '📢', class: 'badge-spam',
    keywords: ['follow me','check my page','dm me','link in bio','promo','discount','buy now','free',
      'click here','check out my','follow back','f4f','like4like','follow for follow','visit my','earn money',
      'make money','100% free','limited offer','shop now','giveaway','win a','subscribe to my']
  },
  question: {
    label: 'Question', icon: '❓', class: 'badge-question',
    keywords: ['how do','what is','when did','where can','why does','who made','can you explain',
      'could you','do you know','is this','are you','what do you use','what brand','where did you get',
      'how much','how long','how often','can you share','would you','what are your thoughts','any tips']
  },
  motivation: {
    label: 'Motivation', icon: '💪', class: 'badge-motivation',
    keywords: ['keep going','you got this','never give up','stay strong','believe in yourself','push harder',
      'hustle','grind','inspire','work hard','dream big','success','mindset','goals','discipline',
      'consistency','dedication','persevere','champions','warrior','rise up','unstoppable','power']
  },
  neutral: {
    label: 'Neutral', icon: '💬', class: 'badge-neutral',
    keywords: ['okay','ok','fine','sure','maybe','alright','noted','i see','interesting','hmm',
      'not sure','could be','perhaps','possibly','depends','fair enough','reasonable','makes sense']
  }
};

function classifyComment(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [cat, data] of Object.entries(CATEGORIES)) {
    scores[cat] = data.keywords.filter(k => lower.includes(k)).length;
  }
  const max = Math.max(...Object.values(scores));
  if (max === 0) return 'appreciate'; // default to neutral-positive
  return Object.keys(scores).find(k => scores[k] === max) || 'appreciate';
}

function getCategoryData(cat) {
  return CATEGORIES[cat] || CATEGORIES.appreciate;
}

// ── Mock Data Generator ──
function generateMockPosts(niche) {
  const niches = {
    lifestyle: ['Morning Routine 2024 ✨','My apartment tour 🏠','5 habits that changed my life','Week in my life vlog','Skincare routine revealed'],
    fitness: ['Full body workout 💪','My diet plan exposed','30-day transformation','Gym motivation dump','Post-workout recovery tips'],
    food: ['Pasta from scratch 🍝','Healthy meal prep Sunday','Secret family recipe','5-min breakfast ideas','Restaurant vs. homemade'],
    tech: ['iPhone 16 first look 📱','Best apps of 2025','My home office setup','AI tools I use daily','Tech that changed my workflow'],
    fashion: ['OOTD haul 👗','Thrifted fits challenge','Style secrets revealed','How to dress for your body','Capsule wardrobe 2025'],
    travel: ['Hidden gems in Bali 🌴','Budget Europe trip guide','Solo travel tips','Best local food spots','Travel packing hacks'],
    business: ['How I made $10k online','Passive income streams','Morning routine of CEOs','Productivity systems','Side hustle that works'],
    comedy: ['POV: Monday morning','Types of gym people','What your zodiac does','Office life be like','Expectation vs. reality']
  };

  const topics = niches[niche] || niches.lifestyle;
  return topics.map((title, i) => ({
    id: `post_${i}`,
    title,
    image: `https://picsum.photos/seed/${niche}${i}/300/300`,
    likes: Math.floor(Math.random() * 50000) + 1000,
    comments: Math.floor(Math.random() * 500) + 50,
    date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {month:'short', day:'numeric'}),
    rawComments: generateMockComments(niche, i)
  }));
}

function generateMockComments(niche, seed) {
  const pool = [
    // praise
    { text: 'This is absolutely amazing! You never disappoint 🔥', cat: 'praise' },
    { text: 'OMG this is fire! Best content on my feed rn', cat: 'praise' },
    { text: 'You are a LEGEND. This is next level content 🌟', cat: 'praise' },
    { text: 'Obsessed with this! Keep doing what you do 👏', cat: 'praise' },
    { text: 'Wow this is stunning, incredible work as always!', cat: 'praise' },
    { text: 'This might be your best post yet. Outstanding!', cat: 'praise' },
    // appreciate
    { text: 'Thank you so much for sharing this, it really helped me!', cat: 'appreciate' },
    { text: 'I needed this today. Really motivated now!', cat: 'appreciate' },
    { text: 'Just followed! This is exactly what I was looking for 💚', cat: 'appreciate' },
    { text: 'This is so helpful, keep going! You inspire me daily', cat: 'appreciate' },
    { text: 'Saved this! Been waiting for someone to make this content', cat: 'appreciate' },
    { text: 'Well done! This is very informative and valuable 🙏', cat: 'appreciate' },
    // comic
    { text: 'Bro I literally LOL\'d 😂 why is this so accurate', cat: 'comic' },
    { text: 'HAHAHA I\'m crying 🤣 this is too funny', cat: 'comic' },
    { text: 'Dead 💀💀 the way this hit different', cat: 'comic' },
    { text: 'Lmao not me relating to every single second of this 😭', cat: 'comic' },
    { text: 'I\'m done. Screaming. This is hilarious 😂', cat: 'comic' },
    // hate
    { text: 'This is terrible honestly. Worst content I\'ve seen', cat: 'hate' },
    { text: 'Disgusting, you\'re so dumb for posting this lol', cat: 'hate' },
    { text: 'Awful. This is pathetic and embarrassing', cat: 'hate' },
    // abuse
    { text: 'Shut up and go away nobody asked for this', cat: 'abuse' },
    { text: 'This is bullying us with bad content smh', cat: 'abuse' },
    // politics
    { text: 'This is so political, the government doesn\'t want you to know this!', cat: 'politics' },
    { text: 'People need to vote and hold these corrupt politicians accountable', cat: 'politics' },
    { text: 'This is exactly why democracy is failing — the agenda is real', cat: 'politics' },
    { text: 'Left wing propaganda as usual, wake up people 🏛️', cat: 'politics' },
    { text: 'The policy changes are destroying everything. We need real opposition', cat: 'politics' },
    // education
    { text: 'This is so educational! I learned more here than in any lecture 📚', cat: 'education' },
    { text: 'Would love a full course or tutorial on this topic!', cat: 'education' },
    { text: 'Every student should be made to study this content. So valuable!', cat: 'education' },
    { text: 'As a professor, I must say this is extremely well researched', cat: 'education' },
    { text: 'The academic depth here is incredible. What\'s your research background?', cat: 'education' },
    // tech
    { text: 'Which app or software do you use for this? Looks like a great tool!', cat: 'tech' },
    { text: 'The AI behind this is mind-blowing. What algorithm powers it?', cat: 'tech' },
    { text: 'As a developer, I appreciate the tech stack choices here 💻', cat: 'tech' },
    { text: 'This gadget changed my workflow completely. The code is clean too!', cat: 'tech' },
    { text: 'Built an API integration for this — innovation at its peak!', cat: 'tech' },
    // sarcasm
    { text: 'Oh wow, yeah right, totally never seen this before. So original 😏', cat: 'sarcasm' },
    { text: 'Sure sure, must be nice to think this is groundbreaking content', cat: 'sarcasm' },
    { text: 'How unexpected! Obviously this would blow up. Shocking 🙄', cat: 'sarcasm' },
    { text: 'Oh really?? Great job discovering water. Totally impressive', cat: 'sarcasm' },
    { text: 'Clearly nobody has ever thought of this before. What a surprise!', cat: 'sarcasm' },
    // spam
    { text: 'Follow me back! I follow everyone 🙏 f4f like4like', cat: 'spam' },
    { text: 'Check my page for FREE giveaway! Limited offer ends today 🎁', cat: 'spam' },
    { text: 'DM me to earn money from home — 100% free no investment needed!', cat: 'spam' },
    { text: 'Shop now! Discount code in my bio, link in bio 🛒 buy now!', cat: 'spam' },
    { text: 'Subscribe to my channel for more! Follow for follow back always 👇', cat: 'spam' },
    // question
    { text: 'How do you manage to stay so consistent? Any tips for beginners?', cat: 'question' },
    { text: 'What camera and settings do you use for this? The quality is insane', cat: 'question' },
    { text: 'Can you explain how this works step by step? I\'m a bit confused', cat: 'question' },
    { text: 'Where did you get that from? What brand is it? How much did it cost?', cat: 'question' },
    { text: 'How long did this take you? Do you do this every day?', cat: 'question' },
    // motivation
    { text: 'This is exactly what I needed! Keep going, you\'re inspiring thousands 💪', cat: 'motivation' },
    { text: 'Never give up! Your discipline and consistency is unmatched. Goals!', cat: 'motivation' },
    { text: 'You are the definition of hustle and grind. Stay unstoppable! 🔥', cat: 'motivation' },
    { text: 'This pushes me to work hard and believe in myself. Thank you!', cat: 'motivation' },
    { text: 'Champions never quit. You are a true warrior. Dream big always!', cat: 'motivation' },
    // neutral
    { text: 'Interesting, I\'m not sure what to think about this tbh', cat: 'neutral' },
    { text: 'Okay, that makes sense I guess. Could be better though', cat: 'neutral' },
    { text: 'Hmm, depends on the situation. Fair enough I suppose', cat: 'neutral' },
    { text: 'Alright, noted. Not bad, not great. Just okay overall', cat: 'neutral' },
    { text: 'Maybe, possibly. It\'s reasonable but I\'m still on the fence', cat: 'neutral' },
  ];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const count = 18 + (seed % 5) * 3;
  const names = ['alexr','_priya99','john.doe','fashionbee','techguru88','maria_m','sunset.vibes','kodak_k','lisa.waves','traveler_x','urban.leo','_not_me_','zero_hero','calmwaves','future_now'];
  const result = [];
  for (let i = 0; i < count; i++) {
    const base = shuffled[i % shuffled.length];
    result.push({
      id: `c_${seed}_${i}`,
      user: names[i % names.length],
      avatar: `https://i.pravatar.cc/40?img=${(seed * 5 + i) % 70 + 1}`,
      text: base.text,
      category: base.cat,
      time: `${Math.floor(Math.random() * 23) + 1}h ago`,
      likes: Math.floor(Math.random() * 200)
    });
  }
  return result;
}

function getCategoryStats(comments) {
  const stats = {};
  Object.keys(CATEGORIES).forEach(k => stats[k] = 0);
  comments.forEach(c => { if (stats[c.category] !== undefined) stats[c.category]++; });
  return stats;
}
