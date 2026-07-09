// ── Trend Engine ──

const TREND_DATA = {
  lifestyle: [
    { tag:'#MorningRoutine', posts:'4.2M', growth:'+32%', score:94, tip:'Post your morning routine between 6–8am for 2x engagement.' },
    { tag:'#GlowUp2025', posts:'2.8M', growth:'+58%', score:89, tip:'Before/after transformations are getting 3x saves right now.' },
    { tag:'#SlowLiving', posts:'1.9M', growth:'+21%', score:78, tip:'Aesthetic calm videos outperform fast cuts for this niche.' },
    { tag:'#VintageVibes', posts:'3.1M', growth:'+44%', score:86, tip:'Vintage aesthetics are trending with 18–24 audience this week.' },
    { tag:'#WellnessJourney', posts:'5.6M', growth:'+19%', score:72, tip:'Personal story reels drive 4x more followers than tips posts.' },
  ],
  fitness: [
    { tag:'#GymLife', posts:'8.2M', growth:'+12%', score:91, tip:'Gym fail/win combos get 5x more shares.' },
    { tag:'#HomeWorkout', posts:'6.4M', growth:'+28%', score:85, tip:'No-equipment workouts are spiking — capitalize now.' },
    { tag:'#TransformationTuesday', posts:'11M', growth:'+8%', score:88, tip:'Tuesday posts get 22% higher reach in fitness niche.' },
    { tag:'#NutritionTips', posts:'3.2M', growth:'+41%', score:80, tip:'Meal prep content is exploding — pair with recipes.' },
    { tag:'#FitCheck', posts:'4.8M', growth:'+35%', score:82, tip:'OOTD-style fit check posts boost profile visits by 60%.' },
  ],
  food: [
    { tag:'#EasyRecipes', posts:'9.1M', growth:'+24%', score:93, tip:'Under-5-minute recipes are the fastest growing food content.' },
    { tag:'#MealPrep', posts:'7.3M', growth:'+31%', score:88, tip:'Sunday meal prep posts get 40% more saves on average.' },
    { tag:'#FoodTok', posts:'15M', growth:'+18%', score:90, tip:'Short recipe reveals (reveal at end) boost watch time 3x.' },
    { tag:'#HealthyEating', posts:'6.8M', growth:'+22%', score:84, tip:'Macro breakdown overlay on food shots is trending hard.' },
    { tag:'#CookingHacks', posts:'4.2M', growth:'+47%', score:87, tip:'Kitchen hack reels get shared 6x more than regular recipes.' },
  ],
  tech: [
    { tag:'#AITools', posts:'3.8M', growth:'+82%', score:97, tip:'AI productivity content is the #1 fastest growing tech niche.' },
    { tag:'#TechSetup', posts:'5.1M', growth:'+34%', score:89, tip:'Desk setup tours consistently rank in top 10% for saves.' },
    { tag:'#AppReview', posts:'2.3M', growth:'+29%', score:82, tip:'Honest negative reviews get 3x more engagement than promo.' },
    { tag:'#TechHacks', posts:'6.9M', growth:'+41%', score:91, tip:'Life-changing phone settings posts go viral regularly.' },
    { tag:'#FutureOfTech', posts:'1.8M', growth:'+67%', score:86, tip:'Prediction content drives comments and shares simultaneously.' },
  ],
  fashion: [
    { tag:'#OOTD', posts:'22M', growth:'+11%', score:95, tip:'Outfit of the day with location tagging boosts local discovery.' },
    { tag:'#ThriftFlip', posts:'4.3M', growth:'+65%', score:92, tip:'Thrift transformation reels average 2M+ views per viral hit.' },
    { tag:'#CapsuleWardrobe', posts:'2.1M', growth:'+48%', score:85, tip:'Capsule wardrobe content saves are 5x higher than average.' },
    { tag:'#StyleInspo', posts:'8.7M', growth:'+19%', score:88, tip:'Style inspiration carousels get 3x more shares than single shots.' },
    { tag:'#VintageFinds', posts:'3.4M', growth:'+55%', score:87, tip:'Vintage finds with price reveals drive massive engagement.' },
  ],
  travel: [
    { tag:'#HiddenGems', posts:'7.2M', growth:'+43%', score:93, tip:'Hidden location reveals generate massive save rates (60%+).' },
    { tag:'#SoloTravel', posts:'4.8M', growth:'+38%', score:89, tip:'Solo travel safety tips are underserved — huge opportunity.' },
    { tag:'#BudgetTravel', posts:'3.9M', growth:'+51%', score:91, tip:'Budget breakdowns with receipts are the most shared travel content.' },
    { tag:'#TravelHacks', posts:'5.6M', growth:'+27%', score:86, tip:'Airport/packing hacks consistently outperform destination posts.' },
    { tag:'#DigitalNomad', posts:'2.8M', growth:'+72%', score:88, tip:'Work-from-anywhere content is the fastest growing in travel.' },
  ],
  business: [
    { tag:'#PassiveIncome', posts:'5.4M', growth:'+39%', score:94, tip:'Income proof posts (with screenshots) go viral 8x more often.' },
    { tag:'#EntrepreneurLife', posts:'8.9M', growth:'+22%', score:90, tip:'Behind-the-scenes of building a business drives loyal followers.' },
    { tag:'#SideHustle', posts:'6.1M', growth:'+47%', score:92, tip:'Side hustle income reveals are the #1 saved business content.' },
    { tag:'#MoneyMindset', posts:'3.3M', growth:'+31%', score:85, tip:'Personal money story with lessons drives 4x more shares.' },
    { tag:'#StartupLife', posts:'2.7M', growth:'+28%', score:83, tip:'Failure story followed by comeback is the most viral business arc.' },
  ],
  comedy: [
    { tag:'#POV', posts:'31M', growth:'+14%', score:96, tip:'POV skits consistently hit the explore page — low production ok.' },
    { tag:'#Relatable', posts:'18M', growth:'+19%', score:93, tip:'Relatable content gets 7x more shares than any other comedy type.' },
    { tag:'#Skit', posts:'9.2M', growth:'+22%', score:89, tip:'2–4 character skits outperform solo monologues by 60%.' },
    { tag:'#TrendingAudio', posts:'42M', growth:'+31%', score:95, tip:'Using trending audio within 48h of it going viral 4x reach.' },
    { tag:'#ExpectationVsReality', posts:'6.8M', growth:'+28%', score:88, tip:'Expectation vs. reality format saves are 5x above niche average.' },
  ]
};

const GROWTH_TIPS = [
  { icon:'⏰', title:'Post Timing', body:'Your audience is most active 7–9am and 6–9pm local time. Schedule posts for these windows.' },
  { icon:'💬', title:'Comment Back Fast', body:'Responding within 30 mins of posting boosts algorithmic reach by up to 40%.' },
  { icon:'📌', title:'Pin Your Best', body:'Pin your top 3 performing posts to profile. New visitors convert 2x better.' },
  { icon:'🎵', title:'Trending Audio', body:'Reels using trending audio get 3–5x more distribution than original audio.' },
  { icon:'🔁', title:'Cross-Post Stories', body:'Repost your feed content to Stories within 2 hours for a second wave of reach.' },
  { icon:'🤝', title:'Collab Content', body:'Collaborations with creators in adjacent niches unlock entirely new audience pools.' },
];

function getTrends(niche) {
  return TREND_DATA[niche] || TREND_DATA.lifestyle;
}

function getGrowthTips() {
  return GROWTH_TIPS;
}
