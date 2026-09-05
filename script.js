/* ==========================================================================
   OCEAN QUOTE JAR — script.js
   Vanilla JS. No build step. No backend. No frameworks.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     0. STATE
     ------------------------------------------------------------------ */
  const state = {
    dayText: '',
    mood: null,
    lastQuoteIndex: {},   // per-mood index of last shown quote (avoid immediate repeat)
    shownThisSession: {}, // per-mood set of shown quote texts this session
    currentQuote: null,
    soundOn: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const SCREENS = ['welcome', 'day', 'mood', 'jar', 'quote', 'saved'];

  /* ------------------------------------------------------------------
     1. MOODS
     ------------------------------------------------------------------ */
  const moods = [
    { key: 'happy',      icon: '☀️', name: 'Happy',      desc: 'feeling sunny' },
    { key: 'sad',        icon: '🌧️', name: 'Sad',        desc: 'need some comfort' },
    { key: 'motivated',  icon: '🔥', name: 'Motivated',  desc: 'ready to move' },
    { key: 'calm',       icon: '🌊', name: 'Calm',       desc: 'floating steady' },
    { key: 'confused',   icon: '🪼', name: 'Confused',   desc: 'my brain is floating' },
    { key: 'angry',      icon: '🌋', name: 'Angry',      desc: 'a little stormy' },
    { key: 'lonely',     icon: '🐚', name: 'Lonely',     desc: 'missing company' },
    { key: 'tired',      icon: '🌙', name: 'Tired',      desc: 'running low' },
    { key: 'excited',    icon: '⭐', name: 'Excited',    desc: 'buzzing a bit' },
    { key: 'anxious',    icon: '🌫️', name: 'Anxious',    desc: 'mind is loud' },
    { key: 'grateful',   icon: '🌸', name: 'Grateful',   desc: 'counting the good' },
    { key: 'hope',       icon: '✨', name: 'Need a little hope', desc: 'looking for a light' }
  ];

  /* ------------------------------------------------------------------
     2. QUOTE DATABASE
     Every message below is an original "Ocean Quote Jar" note — no
     quotations are attributed to real people, to keep this collection
     safely and honestly original.
     ------------------------------------------------------------------ */
  function mk(list) {
    const authors = ['Your little ocean note', 'A little note from the sea'];
    return list.map((text, i) => ({ text, author: authors[i % 2], type: 'original' }));
  }

  const quotes = {
    happy: mk([
      "Hold onto this feeling a little longer. It's allowed to last.",
      "You look good in sunlight. Metaphorically. Also probably literally.",
      "Some days just click into place. Let this be one you remember.",
      "The ocean has good days too — flat, warm, easy. This is yours.",
      "Whatever's making you smile right now, let it keep going.",
      "You earned this lightness. Don't apologize for it.",
      "Good moods are worth noticing, not just good news.",
      "This is what it feels like when things line up. Enjoy the alignment.",
      "Even the seagulls seem less annoying today, huh?",
      "A good day doesn't need a reason. Yours doesn't either.",
      "You're allowed to be happy without waiting for the other shoe.",
      "Bottle this one. You'll want it on a rainier day.",
      "Sunshine looks great on you, and so does this mood.",
      "Nothing dramatic happened. You're just having a nice day. That counts.",
      "Let yourself enjoy this without immediately planning the next thing.",
      "The tide's in your favor today. Ride it a little.",
      "This is a good version of you. Say hello to it.",
      "Small joys stack up. You're stacking a good pile today.",
      "You deserve days that feel this easy.",
      "Take a mental photo. Today's a keeper.",
      "Happiness doesn't need to be earned to be real.",
      "You're glowing a little today. Even the fish noticed.",
      "This lightness in your chest is just you, unburdened for a bit.",
      "Some days the world just works with you instead of against you.",
      "You don't need permission to feel this good.",
      "Whatever's fueling this mood, keep feeding it.",
      "Good days are practice for believing more are coming.",
      "You laughed today. That's not small.",
      "This joy is yours. No footnotes needed.",
      "Let today be uncomplicated. You've earned uncomplicated.",
      "The waves are calm and so, for once, is your mind.",
      "Not every good day needs an explanation. This one doesn't either.",
      "You seem lighter today. It suits you.",
      "Ride this feeling as far as it'll take you.",
      "Today's a good one. Let it be enough."
    ]),
    sad: mk([
      "You don't have to turn today into a good day. Getting through it is enough.",
      "Even the ocean has quiet, grey days.",
      "It's okay to just sit with this feeling instead of fixing it right now.",
      "You're allowed to be sad without a reason that satisfies anyone else.",
      "This heaviness won't last forever, even if it feels permanent right now.",
      "Some days ask less of you. Let this be one of them.",
      "You're not failing. You're just having a hard day.",
      "It's fine to not be okay today. You don't owe anyone a good mood.",
      "The tide always comes back in. So will you, eventually.",
      "You don't need to explain your sadness to make it valid.",
      "Crying isn't weakness. It's just water finding its way out.",
      "Some sadness doesn't need solving. It just needs company.",
      "You're carrying something heavy. That's allowed to show.",
      "Not every day is meant to be strong. Today can just be survived.",
      "It's okay if today's win is simply that you're still here.",
      "This feeling is real, but it isn't the whole forecast.",
      "You don't have to smile through this one.",
      "Sadness isn't a problem to be corrected by tomorrow morning.",
      "You're doing better than you think, even on a day like this.",
      "Let yourself be gentle with whatever this sadness is about.",
      "You don't need to perform okay-ness for anyone right now.",
      "It's alright to feel small today. You'll feel bigger again.",
      "This isn't the end of the story, just a heavy chapter.",
      "You're allowed to rest inside this feeling instead of rushing past it.",
      "Nothing about today's sadness makes you less capable tomorrow.",
      "The waves get rough sometimes. You're still the boat, not the storm.",
      "You don't have to hide this from yourself.",
      "It's okay to just breathe today. That can be the whole plan.",
      "Some days are for enduring, not achieving.",
      "You're not alone in feeling this, even if it feels that way.",
      "Let today be soft on you, even if nothing else is.",
      "You don't have to justify why you feel low today.",
      "This sadness has an edge somewhere, even if you can't see it yet.",
      "It's okay to need a minute — or a whole day.",
      "You made it through today. That's not nothing."
    ]),
    motivated: mk([
      "You've got a spark today. Don't waste it scrolling.",
      "Momentum likes company. Go find something to move.",
      "You don't need to feel ready. You just need to start.",
      "Today's a good day to do the thing you've been circling.",
      "Small steps still count as moving forward.",
      "Use this energy while it's here. It's not always this loud.",
      "You're not behind. You're just about to begin.",
      "Progress doesn't have to be pretty to count.",
      "This is the version of you that gets things done. Let it lead.",
      "One task. Just start with one.",
      "You don't have to want to do it. You just have to do it.",
      "Discipline is just motivation that showed up anyway.",
      "You're capable of more than today's to-do list suggests.",
      "Let today's drive carry you past yesterday's excuses.",
      "The hardest part is usually just opening the laptop.",
      "You've done harder things than this. Remember that.",
      "Momentum builds quietly. Keep feeding it.",
      "You're not chasing perfect today. You're chasing done.",
      "Today's effort is tomorrow's easier day.",
      "Get moving before your motivation checks its phone and leaves.",
      "You don't need a perfect plan, just a next step.",
      "This drive won't last forever, so put it to work now.",
      "You're allowed to be proud of small, boring progress.",
      "Future you is quietly hoping present you follows through.",
      "Consistency beats intensity. Show up again today.",
      "You're closer than you think. Keep going.",
      "This is the energy that gets things off your list.",
      "Do the annoying task first. Everything after feels easier.",
      "You're not starting from zero. You're starting from experience.",
      "Let today be the day you stop waiting for motivation and just move.",
      "Big goals are just small tasks wearing a trench coat.",
      "You've got fuel today. Point it somewhere useful.",
      "Discomfort now, relief later. That's the whole trade.",
      "You don't have to finish everything today. Just move something forward.",
      "This is your sign to actually open that tab you've been avoiding."
    ]),
    calm: mk([
      "Let your shoulders drop an inch. You've been holding them too high.",
      "There's nowhere else you need to be than exactly here.",
      "The water doesn't rush to be still. It just is.",
      "Breathe like you've got nowhere urgent to be.",
      "This quiet is allowed to last as long as you need it to.",
      "Stillness isn't laziness. It's maintenance.",
      "You don't have to fill this silence with anything.",
      "The calm you feel right now is doing more than it looks like.",
      "Slow down. Nothing here is asking you to hurry.",
      "This peace is yours. No one's coming to take it.",
      "Let your thoughts drift instead of chasing them.",
      "A quiet mind is still a productive one, in its own way.",
      "You don't need a reason to feel this settled.",
      "The tide doesn't rush either. It just moves when it's ready.",
      "This calm is a good place to rest, not just pass through.",
      "Nothing needs solving right this second.",
      "Let today be unhurried.",
      "Your nervous system thanks you for this pause.",
      "Stillness is where the good ideas quietly show up.",
      "You've earned this soft, uneventful moment.",
      "There's a kind of strength in just being calm right now.",
      "Let the quiet do its work.",
      "You don't have to be doing something to be doing okay.",
      "This peace doesn't need to be productive to be worthwhile.",
      "Settle in. There's no clock on this feeling.",
      "The best conversations with yourself happen in quiet like this.",
      "You're allowed to just exist for a while.",
      "Let this calm be the whole point of the moment.",
      "Nothing is chasing you right now. You can slow down.",
      "This stillness is recharging something you can't see yet.",
      "Some days are for doing. This one's for just being.",
      "You don't need background noise to feel okay.",
      "The water's calm today. So, for once, are you.",
      "This is what enough feels like.",
      "Rest here for a bit. There's room."
    ]),
    confused: mk([
      "You don't need to have this figured out today.",
      "Confusion isn't a failure. It's just information still arriving.",
      "It's okay to not know yet. Clarity isn't always on schedule.",
      "You're allowed to sit in the fog for a while.",
      "Not knowing what you feel is still a valid thing to feel.",
      "Some answers take longer to surface than others.",
      "You don't have to untangle everything right now.",
      "It's fine if today's only progress is admitting you're unsure.",
      "Confusion usually means you're paying attention to something real.",
      "You don't owe anyone a clear answer before you have one.",
      "This fog will lift on its own time, not yours.",
      "It's okay to feel like you're floating a little.",
      "Not every question needs solving today.",
      "You're allowed to change your mind while you figure this out.",
      "Uncertainty isn't the same as being lost.",
      "Give yourself permission to say 'I don't know yet.'",
      "Some things make more sense in hindsight. This might be one of them.",
      "You don't need a map for every part of the ocean.",
      "It's okay if today's plan is just 'wait and see.'",
      "Confusion is just clarity that hasn't arrived yet.",
      "You can hold two conflicting feelings without resolving them today.",
      "This murky feeling is temporary, even if it doesn't feel that way.",
      "You're not behind for still figuring this out.",
      "Sometimes the fog clears the moment you stop straining to see through it.",
      "It's okay to ask for help finding your footing.",
      "Not knowing is uncomfortable, but it's not dangerous.",
      "You don't need certainty to keep moving forward, just direction.",
      "This confusion might just be growth, mid-transformation.",
      "You're allowed to feel unsettled without it meaning something's wrong.",
      "Give it time. Some things settle like sand after a wave.",
      "You don't have to explain your uncertainty to make it real.",
      "It's fine to feel a little lost between two things.",
      "Clarity often shows up quietly, after you stop demanding it.",
      "You're not required to have an opinion on this yet.",
      "This in-between feeling is just part of getting somewhere."
    ]),
    angry: mk([
      "Your anger is telling you something. It's worth listening to, at least once.",
      "It's okay to be furious about something that deserved it.",
      "You don't have to calm down just to make others comfortable.",
      "This anger is valid, even if it's inconvenient right now.",
      "Sometimes frustration is just care with nowhere to go.",
      "You're allowed to be upset without immediately fixing your face about it.",
      "Anger isn't the opposite of okay. Sometimes it's proof you care.",
      "You don't owe anyone a calm reaction to something unfair.",
      "It's fine to need space before you respond to anything.",
      "This heat will pass. It doesn't have to be permanent to be real.",
      "You're not overreacting just because someone said you are.",
      "Let yourself feel this before you decide what to do about it.",
      "Anger can be information, not just noise.",
      "It's okay to set a boundary while you're still upset.",
      "You don't have to justify why this bothered you.",
      "Some things are worth being angry about. This might be one.",
      "Let the wave of it pass through instead of holding it in.",
      "You're allowed to be mad and still be a reasonable person.",
      "This frustration doesn't make you difficult. It makes you human.",
      "Take the walk, run the cold tap, do whatever helps it move through.",
      "Anger that's honest is better than calm that's fake.",
      "You don't have to swallow this to keep the peace.",
      "It's okay if today's mood is just 'irritated, and that's fine.'",
      "This isn't you being dramatic. It's you noticing something real.",
      "Give the anger somewhere to go that isn't at yourself.",
      "You're allowed to name what upset you, clearly and without apology.",
      "Not every fire needs to be put out immediately.",
      "This feeling will cool. Let it, on its own time.",
      "You don't need to perform patience you don't have right now.",
      "It's okay to be short today. Tomorrow you can be soft again.",
      "Your limits are allowed to have edges.",
      "This anger might be pointing at something worth changing.",
      "You're not required to forgive this before you're ready.",
      "Let yourself be annoyed without turning it into guilt.",
      "Even rough water eventually settles. So will you."
    ]),
    lonely: mk([
      "Being alone right now doesn't mean you're unlovable. It just means you're alone right now.",
      "You don't have to be surrounded by people to matter.",
      "This loneliness is real, but it isn't permanent.",
      "Even far apart, someone out there is thinking of you.",
      "You're allowed to miss company without it meaning something's wrong with you.",
      "Reaching out first isn't weakness. It's often just what's needed.",
      "It's okay to feel disconnected today. Connection isn't always constant.",
      "You matter to more people than this moment is letting you feel.",
      "Being unseen right now doesn't erase the people who do see you.",
      "This quiet doesn't mean you're forgotten.",
      "You don't have to fill this loneliness immediately. Just notice it.",
      "Even the ocean is full of creatures who spend most of their time alone.",
      "Solitude and loneliness aren't always the same, but both are allowed.",
      "You're not too much. You just haven't found your people in this moment.",
      "This feeling doesn't reflect your worth, just your circumstances right now.",
      "Someone would be glad to hear from you today, even if it doesn't feel that way.",
      "You don't need a crowd to feel less alone. Sometimes one message helps.",
      "It's okay to admit you want company today.",
      "This ache for connection is human, not a flaw.",
      "You are allowed to take up space in someone's thoughts, even from a distance.",
      "Being alone with your thoughts tonight doesn't mean you'll be alone tomorrow.",
      "You don't have to earn belonging. It's not a reward system.",
      "This loneliness might just be missing something specific, not everything.",
      "You're closer to connection than you think — sometimes it's one text away.",
      "It's okay to feel far from people even when they're technically close.",
      "You deserve people who reach back when you reach out.",
      "This isn't proof that you're unlikable. It's just a hard, quiet stretch.",
      "You don't have to carry this feeling alone tonight — even writing it down helps.",
      "Some ships pass in the dark. Doesn't mean the harbor's empty.",
      "You're allowed to want closeness and not have it figured out yet.",
      "This feeling will ease. Connection has a way of finding its way back.",
      "You're not invisible. You just haven't been seen today.",
      "It's okay to feel this and still believe better days are near.",
      "You deserve warmth, even on days that feel cold.",
      "This loneliness doesn't define you. It's just weather, not climate."
    ]),
    tired: mk([
      "Rest isn't falling behind. The tide rests too.",
      "You don't have to earn a break by exhausting yourself first.",
      "It's okay to do less today. Less is still something.",
      "Your body is asking for something. Maybe just listen this once.",
      "Tired isn't lazy. It's just tired.",
      "You don't need a good reason to rest. Being tired is reason enough.",
      "Let today's bar be low. You can raise it again tomorrow.",
      "Even the sea pulls back sometimes before it comes in again.",
      "You're allowed to close the laptop before everything's done.",
      "Rest is productive. It just doesn't look like it.",
      "You don't have to push through today. You're allowed to stop.",
      "This tiredness is data, not weakness.",
      "Sleep is not a reward. It's a requirement.",
      "You've been running on empty. Fill up before you go further.",
      "It's fine if today is just survival mode.",
      "You're not behind for needing to slow down.",
      "Let yourself nap without narrating why you deserve it.",
      "Tired minds make worse decisions. Rest first, decide later.",
      "You don't owe anyone your last bit of energy today.",
      "Recovery isn't the opposite of progress. It's part of it.",
      "You can pick this back up tomorrow with more in the tank.",
      "This exhaustion isn't permanent, even if it feels heavy right now.",
      "It's okay to cancel plans when your body says stop.",
      "You've been carrying a lot. Set some of it down tonight.",
      "Rest now so you don't run on fumes later.",
      "You don't have to be useful every hour of the day.",
      "This is your sign to actually go to bed early tonight.",
      "Tired is temporary. Burnt out takes longer to undo. Rest before it gets there.",
      "You're allowed to do nothing productive for the rest of today.",
      "Even waves need a shore to land on.",
      "You've done enough today. Let that be true.",
      "Slow down before your body slows you down for you.",
      "Rest isn't quitting. It's maintenance for the next push.",
      "You don't need permission to be tired. You already are.",
      "Let tonight be about recovery, not achievement."
    ]),
    excited: mk([
      "This excitement is contagious. Let it spread a little.",
      "Whatever's coming, you're clearly ready to meet it.",
      "Let yourself be loud about this one.",
      "This feeling is fuel. Use it before it settles.",
      "You've got main-character energy today. Enjoy it.",
      "Good things are allowed to feel this good.",
      "Let the excitement carry you further than usual today.",
      "This is the kind of energy that makes things happen.",
      "You don't have to downplay how thrilled you are.",
      "Whatever it is, it's clearly worth this much enthusiasm.",
      "Ride this wave while it's cresting.",
      "This anticipation is half the fun. Enjoy it.",
      "You're buzzing today, and it looks good on you.",
      "Let this excitement be as big as it wants to be.",
      "Some feelings deserve exclamation points. This is one.",
      "You don't need to justify being this hyped.",
      "This is what looking forward to something feels like. Savor it.",
      "Let today's energy carry into tomorrow's plans.",
      "You're allowed to talk about this thing nonstop today.",
      "This spark is worth chasing a little further.",
      "Whatever's ahead, you're clearly bringing good energy to it.",
      "Let yourself get a little carried away today.",
      "This kind of excitement doesn't need to be earned, just enjoyed.",
      "You're practically glowing with this one. Let it show.",
      "The countdown feeling is half the reward.",
      "This is your sign to actually celebrate, out loud, today.",
      "You've got momentum. Point it at something fun.",
      "Let today be a little louder than usual.",
      "This excitement means something good is finally moving.",
      "You're allowed to be this thrilled over something 'small.'",
      "Good anticipation is its own kind of happiness.",
      "This feeling deserves a little dance, honestly.",
      "Let yourself be fully here for this good feeling.",
      "This is the fun part. Don't rush past it.",
      "Whatever's got you this excited, tell someone about it today."
    ]),
    anxious: mk([
      "You don't have to solve everything your mind is spinning on right now.",
      "This anxious feeling is loud, but it isn't the whole truth.",
      "You're safe in this exact moment, even if your mind disagrees.",
      "It's okay to not have control over this. Most things aren't fully controllable.",
      "Your nervous system is trying to protect you, even if it's overdoing it.",
      "You don't need to fix the worry, just notice it without feeding it.",
      "This feeling will pass through, even if it doesn't feel temporary.",
      "You're allowed to take this one breath at a time instead of all at once.",
      "Not every worry is a warning. Some are just noise.",
      "You've gotten through anxious days before. This is another one to get through.",
      "It's okay to name the fear out loud. It tends to shrink a little.",
      "You don't have to trust every thought your anxiety hands you.",
      "This tight feeling in your chest is uncomfortable, not dangerous.",
      "You're allowed to slow down instead of spiraling forward.",
      "Uncertainty is hard, but it isn't the same as danger.",
      "You don't need to prepare for every possible outcome tonight.",
      "This is your mind trying to keep you safe. Thank it, then set it down.",
      "You're doing okay, even if it doesn't feel that way right now.",
      "It's fine to ground yourself in something small — your breath, your feet, the floor.",
      "This anxious energy doesn't mean something bad is about to happen.",
      "You don't have to figure out the whole future in this one moment.",
      "Let the wave of worry pass through you instead of holding it back.",
      "You're allowed to ask for reassurance today.",
      "This feeling is real, but it isn't a fact about what's coming.",
      "You don't need to be certain to be okay.",
      "It's alright to step away from the thing that's spiking this feeling.",
      "You've survived every anxious day so far. That's a good track record.",
      "This isn't forever, even when your mind insists it is.",
      "You don't have to earn calm. It can just arrive.",
      "Let your shoulders drop, even a little. Your body is listening.",
      "This worry doesn't need an immediate answer.",
      "You're allowed to take up less today and just get through it.",
      "Your anxiety is loud right now, but it isn't in charge.",
      "It's okay to not know how this turns out yet.",
      "One small, steady breath. That's all this moment needs from you."
    ]),
    grateful: mk([
      "Noticing the good stuff is its own quiet skill. You're using it today.",
      "This gratitude doesn't need to be dramatic to be real.",
      "Small good things deserve to be counted too.",
      "You're allowed to feel thankful without waiting for something huge.",
      "This warm feeling is worth sitting in for a minute.",
      "Gratitude looks good on you today.",
      "Let yourself really notice what's going right, even briefly.",
      "This appreciation you're feeling is worth writing down somewhere.",
      "Not everything has to be perfect for you to be grateful.",
      "You're noticing the good today. That's a quiet kind of wealth.",
      "This feeling of enough is worth holding onto.",
      "Some days remind you what actually matters. Today might be one.",
      "You don't need a big reason to feel this thankful.",
      "This gratitude is a good place to rest for a while.",
      "Let today's small kindnesses count for something.",
      "You're allowed to feel lucky without guilt attached.",
      "This appreciation is a good sign that you're paying attention.",
      "Thankfulness doesn't cancel hard days. It just sits alongside them.",
      "You're noticing the tide is in your favor today. Good.",
      "This warmth you feel is worth naming out loud to someone.",
      "Gratitude doesn't need proof. Just noticing is enough.",
      "You're allowed to feel this content, even briefly.",
      "This is a good day to say thank you to someone who deserves it.",
      "Let this appreciation stretch a little further than usual today.",
      "Some days the good outweighs the hard. Let today be one of those.",
      "This feeling of fullness is worth trusting.",
      "You don't have to earn gratitude. It's allowed to just show up.",
      "This warmth in your chest is worth paying attention to.",
      "Noticing what's good is a habit worth keeping.",
      "You're allowed to feel thankful for small, unglamorous things.",
      "This is a good moment to remember who's helped you get here.",
      "Gratitude is a quiet kind of joy. Let it stay a while.",
      "You're doing okay, and today you're noticing it. Good.",
      "This appreciation doesn't need to be loud to count.",
      "Let today's gratitude be simple and unforced."
    ]),
    hope: mk([
      "You don't need proof that things will get better. Just a little room to believe it might.",
      "Hope doesn't require certainty, just a small opening.",
      "This isn't the end of your story, just a hard middle chapter.",
      "Something better than this moment is still possible.",
      "You don't have to feel hopeful all at once. A little counts.",
      "The tide always comes back in, even after a long time out.",
      "Things can shift even when nothing looks different yet.",
      "You're allowed to want something better without knowing how it'll happen.",
      "This isn't as fixed as it feels right now.",
      "Small hope is still hope. You don't need the big kind yet.",
      "You've come through hard stretches before. This can be one you come through too.",
      "It's okay to hope quietly, without announcing it to anyone.",
      "Something is still possible here, even if it's not obvious yet.",
      "You don't have to see the whole path to believe there is one.",
      "This feeling of stuck isn't the same as permanent.",
      "Let yourself imagine one small good thing that could happen.",
      "Hope can be as small as getting through today.",
      "You're allowed to keep going without knowing exactly why yet.",
      "Things have changed before when you least expected it.",
      "This chapter is hard, but it isn't the last one.",
      "You don't need a guarantee to keep trying.",
      "Something is quietly shifting, even if you can't feel it yet.",
      "You're closer to a better day than it feels like right now.",
      "It's okay to hold onto a small, unproven hope.",
      "You've made it through worse than you thought you could. Remember that.",
      "This isn't forever, even if it's heavy right now.",
      "Let a little light in, even if you're not ready to trust it yet.",
      "You don't have to feel ready for hope. Just open to it.",
      "Better days don't always announce themselves in advance.",
      "This moment is hard, but it's not the whole forecast.",
      "You're allowed to believe in a version of tomorrow you can't see yet.",
      "Small steps forward still count, even in the dark.",
      "The current shifts eventually. Yours will too.",
      "You don't need certainty, just a reason to keep going one more day.",
      "Something good is still possible here. Let that be enough for now."
    ])
  };

  // "Today's Tide" pool — deterministic pick from a mix of moods, general enough for anyone
  const dailyPool = []
    .concat(quotes.calm, quotes.hope, quotes.grateful, quotes.motivated)
    .map(q => q.text);

  /* ------------------------------------------------------------------
     3. DOM REFS
     ------------------------------------------------------------------ */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const screens = {};
  SCREENS.forEach(name => { screens[name] = $(`#screen-${name}`); });

  const dayText = $('#dayText');
  const charCount = $('#charCount');
  const moodGrid = $('#moodGrid');
  const moodHint = $('#moodHint');
  const btnToJar = $('#btnToJar');
  const jarWrap = $('#jarWrap');
  const jarBubbles = $('#jarBubbles');
  const btnOpenJar = $('#btnOpenJar');
  const quoteContext = $('#quoteContext');
  const quoteCard = $('#quoteCard');
  const quoteText = $('#quoteText');
  const quoteAuthor = $('#quoteAuthor');
  const btnSave = $('#btnSave');
  const saveIcon = $('#saveIcon');
  const saveLabel = $('#saveLabel');
  const dayEcho = $('#dayEcho');
  const savedList = $('#savedList');
  const tideMessage = $('#tideMessage');
  const srLive = $('#srLive');

  /* ------------------------------------------------------------------
     4. SCREEN NAVIGATION
     ------------------------------------------------------------------ */
  function showScreen(name) {
    SCREENS.forEach(s => {
      const el = screens[s];
      if (!el) return;
      if (s === name) {
        el.hidden = false;
        requestAnimationFrame(() => el.classList.add('active'));
      } else {
        el.classList.remove('active');
        // Delay hiding so the exit transition (if any) can play
        setTimeout(() => { if (!el.classList.contains('active')) el.hidden = true; }, state.reducedMotion ? 0 : 500);
      }
    });
    announce(`${name} screen`);
    window.scrollTo({ top: 0, behavior: state.reducedMotion ? 'auto' : 'smooth' });
  }

  function announce(msg) {
    if (srLive) srLive.textContent = msg;
  }

  /* ------------------------------------------------------------------
     5. SCREEN 1 — WELCOME / TODAY'S TIDE
     ------------------------------------------------------------------ */
  function dayOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    return Math.floor(diff / 86400000);
  }
  function setTodaysTide() {
    const idx = dayOfYear(new Date()) % dailyPool.length;
    tideMessage.textContent = dailyPool[idx];
  }

  /* ------------------------------------------------------------------
     6. SCREEN 2 — YOUR DAY
     ------------------------------------------------------------------ */
  function updateCharacterCount() {
    const len = dayText.value.length;
    charCount.textContent = `${len} / 500`;
  }

  /* ------------------------------------------------------------------
     7. SCREEN 3 — MOOD SELECTOR
     ------------------------------------------------------------------ */
  function buildMoodGrid() {
    moodGrid.innerHTML = '';
    moods.forEach(m => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'mood-card';
      card.setAttribute('role', 'option');
      card.setAttribute('aria-selected', 'false');
      card.dataset.mood = m.key;
      card.innerHTML = `
        <span class="mood-icon" aria-hidden="true">${m.icon}</span>
        <span class="mood-name">${m.name}</span>
        <span class="mood-desc">${m.desc}</span>
      `;
      card.addEventListener('click', () => selectMood(m.key));
      moodGrid.appendChild(card);
    });
  }

  function selectMood(key) {
    state.mood = key;
    $all('.mood-card', moodGrid).forEach(card => {
      const isSel = card.dataset.mood === key;
      card.classList.toggle('selected', isSel);
      card.setAttribute('aria-selected', String(isSel));
    });
    const m = moods.find(mm => mm.key === key);
    moodHint.textContent = `"${m.name}" is in the jar with you now.`;
    btnToJar.disabled = false;
  }

  /* ------------------------------------------------------------------
     8. QUOTE ENGINE
     ------------------------------------------------------------------ */
  function getRandomQuote(moodKey) {
    const list = quotes[moodKey];
    if (!list || !list.length) return { text: 'The sea is quiet right now. Try again in a moment.', author: 'A little note from the sea' };

    if (!state.shownThisSession[moodKey]) state.shownThisSession[moodKey] = new Set();
    const shown = state.shownThisSession[moodKey];

    // if we've shown everything, reset the session memory for this mood
    if (shown.size >= list.length) shown.clear();

    let idx;
    let attempts = 0;
    do {
      idx = Math.floor(Math.random() * list.length);
      attempts++;
    } while (
      (idx === state.lastQuoteIndex[moodKey] || shown.has(idx)) &&
      attempts < 30
    );

    state.lastQuoteIndex[moodKey] = idx;
    shown.add(idx);
    return list[idx];
  }

  function getNextQuote() {
    if (!state.mood) return;
    state.currentQuote = getRandomQuote(state.mood);
    return state.currentQuote;
  }

  /* ------------------------------------------------------------------
     9. JAR ANIMATION
     ------------------------------------------------------------------ */
  function spawnJarBubbles() {
    jarBubbles.innerHTML = '';
    const count = state.reducedMotion ? 0 : 10;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      const size = 4 + Math.random() * 8;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = (40 + Math.random() * 20) + '%';
      b.style.setProperty('--bx', (Math.random() * 60 - 30) + 'px');
      b.style.animationDelay = (Math.random() * 0.4) + 's';
      jarBubbles.appendChild(b);
    }
  }

  function playChime() {
    if (!state.soundOn || !ambient.ctx) return;
    try {
      const ctx = ambient.ctx;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.7);
      });
    } catch (e) { /* audio not available — fail silently */ }
  }

  /* ------------------------------------------------------------------
     14b. AMBIENT OCEAN SOUND — synthesized in-browser, no audio files.
     Filtered noise (waves) + a slow swelling volume (the "breathing"
     rhythm of the sea) + one deep soft drone underneath.
     ------------------------------------------------------------------ */
  const ambient = {
    ctx: null,
    nodes: null,
    playing: false
  };

  function ensureAudioContext() {
    if (!ambient.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ambient.ctx = new AC();
    }
    return ambient.ctx;
  }

  function buildNoiseBuffer(ctx, seconds) {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // brown-ish noise: smoother, more wave-like than plain white noise
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.2;
    }
    return buffer;
  }

  function startAmbient() {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (ambient.playing) return;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buildNoiseBuffer(ctx, 6);
    noiseSource.loop = true;

    // filter to keep it soft and "watery" rather than hissy
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;

    // master gain for the whole ambient bed
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;

    // swell gain — mimics waves rolling in and out
    const swell = ctx.createGain();
    swell.gain.value = 0.5;
    const swellLfo = ctx.createOscillator();
    swellLfo.type = 'sine';
    swellLfo.frequency.value = 0.09; // one slow swell roughly every 11 seconds
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.35;
    swellLfo.connect(swellDepth).connect(swell.gain);

    // a very low, soft drone underneath for depth
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 74;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.035;

    noiseSource.connect(filter).connect(swell).connect(masterGain);
    drone.connect(droneGain).connect(masterGain);
    masterGain.connect(ctx.destination);

    noiseSource.start();
    swellLfo.start();
    drone.start();

    // fade in gently
    const now = ctx.currentTime;
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.22, now + 1.6);

    ambient.nodes = { noiseSource, filter, masterGain, swell, swellLfo, swellDepth, drone, droneGain };
    ambient.playing = true;
  }

  function stopAmbient() {
    if (!ambient.playing || !ambient.nodes || !ambient.ctx) return;
    const { masterGain, noiseSource, swellLfo, drone } = ambient.nodes;
    const ctx = ambient.ctx;
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 0.8);
    setTimeout(() => {
      try { noiseSource.stop(); swellLfo.stop(); drone.stop(); } catch (e) { /* already stopped */ }
    }, 850);
    ambient.playing = false;
    ambient.nodes = null;
  }

  let jarBusy = false;
  function animateJar() {
    if (jarBusy || !state.mood) return;
    jarBusy = true;
    btnOpenJar.disabled = true;
    btnOpenJar.textContent = 'Opening…';

    const dur = state.reducedMotion ? 0 : 1;
    jarWrap.classList.add('shaking');
    spawnJarBubbles();

    setTimeout(() => {
      jarWrap.classList.remove('shaking');
      jarWrap.classList.add('opening');
      playChime();
    }, 550 * dur);

    setTimeout(() => {
      jarWrap.classList.add('releasing');
    }, 700 * dur);

    setTimeout(() => {
      revealQuote();
    }, state.reducedMotion ? 50 : 1900);
  }

  function resetJarVisual() {
    jarWrap.classList.remove('opening', 'releasing', 'shaking');
    btnOpenJar.disabled = false;
    btnOpenJar.textContent = 'Open the jar ✨';
    jarBusy = false;
  }

  /* ------------------------------------------------------------------
     10. QUOTE REVEAL
     ------------------------------------------------------------------ */
  function revealQuote() {
    const q = getNextQuote();
    const m = moods.find(mm => mm.key === state.mood);

    quoteContext.textContent = `${m.icon} A message for your "${m.name}" day`;
    quoteText.textContent = q.text;
    quoteAuthor.textContent = `— ${q.author}`;

    updateSaveButton();

    if (state.dayText && state.dayText.trim().length > 0) {
      dayEcho.hidden = false;
      dayEcho.textContent = `You brought ${state.dayText.trim().length} little characters to the shore.`;
    } else {
      dayEcho.hidden = true;
    }

    showScreen('quote');
    resetJarVisual();

    quoteCard.classList.remove('reveal');
    void quoteCard.offsetWidth; // restart animation
    quoteCard.classList.add('reveal');
  }

  function anotherMessage() {
    quoteCard.classList.remove('reveal');
    const q = getNextQuote();
    const m = moods.find(mm => mm.key === state.mood);
    quoteContext.textContent = `${m.icon} A message for your "${m.name}" day`;
    quoteText.textContent = q.text;
    quoteAuthor.textContent = `— ${q.author}`;
    updateSaveButton();
    requestAnimationFrame(() => {
      void quoteCard.offsetWidth;
      quoteCard.classList.add('reveal');
    });
  }

  /* ------------------------------------------------------------------
     11. SAVE / FAVORITES  (localStorage — quote text only, never journal text)
     ------------------------------------------------------------------ */
  const SAVE_KEY = 'oceanQuoteJar.savedMessages';

  function safeGetSaved() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function safeSetSaved(list) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  function isCurrentSaved() {
    if (!state.currentQuote) return false;
    return safeGetSaved().some(s => s.text === state.currentQuote.text);
  }

  function updateSaveButton() {
    const saved = isCurrentSaved();
    btnSave.classList.toggle('saved', saved);
    btnSave.setAttribute('aria-pressed', String(saved));
    saveIcon.textContent = saved ? '♥' : '♡';
    saveLabel.textContent = saved ? 'Saved' : 'Save this message';
  }

  function toggleSaveCurrent() {
    if (!state.currentQuote) return;
    const list = safeGetSaved();
    const idx = list.findIndex(s => s.text === state.currentQuote.text);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift({
        text: state.currentQuote.text,
        author: state.currentQuote.author,
        mood: state.mood,
        savedAt: Date.now()
      });
    }
    safeSetSaved(list);
    updateSaveButton();
  }

  function renderSavedList() {
    const list = safeGetSaved();
    savedList.innerHTML = '';
    if (!list.length) {
      const p = document.createElement('p');
      p.className = 'empty-note';
      p.textContent = 'Your little collection is still empty.';
      savedList.appendChild(p);
      return;
    }
    list.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'saved-item';
      const m = moods.find(mm => mm.key === item.mood);
      div.innerHTML = `
        <p>"${escapeHtml(item.text)}"</p>
        <span>— ${escapeHtml(item.author)}${m ? ' · ' + m.icon + ' ' + m.name : ''}</span>
        <button type="button" aria-label="Remove this saved message">✕</button>
      `;
      div.querySelector('button').addEventListener('click', () => {
        const current = safeGetSaved();
        current.splice(i, 1);
        safeSetSaved(current);
        renderSavedList();
        if (state.currentQuote && state.currentQuote.text === item.text) updateSaveButton();
      });
      savedList.appendChild(div);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------
     12. RESET
     ------------------------------------------------------------------ */
  function resetExperience() {
    state.dayText = '';
    state.mood = null;
    state.currentQuote = null;
    dayText.value = '';
    updateCharacterCount();
    $all('.mood-card', moodGrid).forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-selected', 'false'); });
    moodHint.textContent = 'Pick a mood first 🌊';
    btnToJar.disabled = true;
    resetJarVisual();
    setTodaysTide();
    showScreen('welcome');
  }

  /* ------------------------------------------------------------------
     13. AMBIENT BACKGROUND BUBBLES
     ------------------------------------------------------------------ */
  function buildBubbleField() {
    const field = $('#bubbleField');
    if (!field || state.reducedMotion) return;
    const count = window.innerWidth < 600 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'bg-bubble';
      const size = 6 + Math.random() * 22;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      const duration = 10 + Math.random() * 14;
      b.style.animationDuration = duration + 's';
      b.style.animationDelay = -(Math.random() * duration) + 's';
      b.addEventListener('click', () => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        setTimeout(() => b.remove(), 300);
      });
      field.appendChild(b);
    }
  }

  /* ------------------------------------------------------------------
     14. SOUND TOGGLE
     ------------------------------------------------------------------ */
  function toggleSound() {
    state.soundOn = !state.soundOn;
    const btn = $('#navSound');
    btn.textContent = state.soundOn ? '🔊' : '🔇';
    btn.setAttribute('aria-pressed', String(state.soundOn));
    if (state.soundOn) {
      startAmbient();
    } else {
      stopAmbient();
    }
  }

  /* ------------------------------------------------------------------
     15. EVENT WIRING
     ------------------------------------------------------------------ */
  function wireEvents() {
    $('#btnDive').addEventListener('click', () => showScreen('day'));

    dayText.addEventListener('input', () => {
      state.dayText = dayText.value;
      updateCharacterCount();
    });

    $('#btnBackToWelcome').addEventListener('click', () => showScreen('welcome'));
    $('#btnToMood').addEventListener('click', () => showScreen('mood'));
    $('#btnBackToDay').addEventListener('click', () => showScreen('day'));

    $('#btnToJar').addEventListener('click', () => {
      if (!state.mood) return;
      showScreen('jar');
    });
    $('#btnBackToMood').addEventListener('click', () => showScreen('mood'));

    btnOpenJar.addEventListener('click', animateJar);

    $('#btnAnother').addEventListener('click', () => {
      if (!state.mood) return;
      anotherMessage();
    });
    $('#btnChangeMood').addEventListener('click', () => {
      resetJarVisual();
      showScreen('mood');
    });
    $('#btnStartOver').addEventListener('click', resetExperience);

    btnSave.addEventListener('click', toggleSaveCurrent);

    $('#navHome').addEventListener('click', () => showScreen('welcome'));
    $('#navSaved').addEventListener('click', () => { renderSavedList(); showScreen('saved'); });
    $('#btnCloseSaved').addEventListener('click', () => showScreen('welcome'));
    $('#navReset').addEventListener('click', () => {
      if (confirm('Start over? This clears your current mood and message.')) resetExperience();
    });
    $('#navSound').addEventListener('click', toggleSound);

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      state.reducedMotion = e.matches;
    });
  }

  /* ------------------------------------------------------------------
     16. INIT
     ------------------------------------------------------------------ */
  function init() {
    buildMoodGrid();
    buildBubbleField();
    setTodaysTide();
    updateCharacterCount();
    wireEvents();
    showScreen('welcome');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
