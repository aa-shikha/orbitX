/* ==========================================================
   OrbitX - "Ask about missions" side assistant
   - Floating button (bottom-right) + chat panel
   - Understands English, Hindi (Devanagari) and Hinglish
   - Answers come from the mission data of your launch pages
     (Pioneer-1, Asteria-7, Nova Catch-1) + fleet facts + glossary
   - OPTIONAL: set API_URL to your own AI backend (see chat-proxy-worker.js)
   ========================================================== */
(function () {
  'use strict';

  // '' = built-in knowledge base (works offline, no API key).
  // Real AI: put your proxy URL here, e.g. 'https://orbitx-chat.yourname.workers.dev'
  var API_URL = '';

  var KB = [{"m": "pioneer-1", "n": "Pioneer-1", "h": "Overview", "t": "OrbitX One's first orbital flight: a single reusable booster, one weather satellite, and eleven minutes that proved the whole company. Mission 1. Vehicle: OrbitX One. Payload: WX-Sat 1 (530 kg). Orbit: 560 km SSO. Outcome: Success.", "ov": 1}, {"m": "pioneer-1", "n": "Pioneer-1", "h": "The mission in one sentence", "t": "Pioneer-1 had one job: prove that a rocket built in our own hangar could put a real payload in orbit and bring its first stage back in one piece. The customer was a weather-imaging satellite, WX-Sat 1 — a deliberately simple spacecraft for a first flight, because a demo rocket should never risk anything complicated. The target was a 560 km sun-synchronous orbit. “Sun-synchronous” means the orbit is tilted so the satellite crosses every point on Earth at the same local solar time — essential for weather cameras, because their images need consistent lighting every single day. Reaching it demands a launch almost straight south over the ocean, which is why the mission had a 12-minute window that repeated once per day: miss it, and the geometry is wrong until tomorrow."}, {"m": "pioneer-1", "n": "Pioneer-1", "h": "T−0 — a night launch", "t": "The countdown reached zero at 02:41 local time. At night you can actually see the physics: the nine VX-Merlin engines light in staggered pairs over three seconds, each one checked by the flight computer before the next is allowed to ignite, and the pad floods with light brighter than sunrise. The hold-downs release only after every engine reports full thrust — if one had lagged, the computer would have shut everything down with the rocket still standing. The first minute of flight is the loudest thing a rocket ever does. It climbs almost vertically to escape the thickest air quickly, then rolls over downrange, trading altitude for the sideways speed that orbit requires — about 7.6 km per second by the end."}, {"m": "pioneer-1", "n": "Pioneer-1", "h": "Two minutes in — separation", "t": "At T+2:28, with the sky already black and the engines starved of air to push against, the first stage shut down and the second stage ignited a fraction of a second later. Stage separation is mechanical, not explosive drama: three pneumatic pushers shove the stages apart gently, because a hard jolt could upset the guidance. From here the mission splits into two flights happening at once. The second stage kept burning for six more minutes to finish orbit insertion. The booster, meanwhile, flipped end-for-end using cold-gas thrusters and began its own descent — a controlled fall from 100 km through the same atmosphere the rocket just escaped."}, {"m": "pioneer-1", "n": "Pioneer-1", "h": "T+8:47 — the booster lands itself", "t": "The landing is the part that looks impossible and is actually just arithmetic. Falling supersonic, the booster uses grid fins — four lattice fins on the top — as aerodynamic surfaces to steer, exactly like a dart's flights. Below 3 km it relights one engine for the final burn, kills its velocity to zero, and touches down on four legs on the concrete pad. Total flight time from liftoff to landing: 8 minutes 47 seconds. Landing accuracy matters more than it sounds: the pad is barely 60 metres across, and the booster has no steering once the engine stops. Pioneer-1 landed 1.8 metres from centre — close enough that engineers simply drove a truck out and lowered the legs' stabilisers."}, {"m": "pioneer-1", "n": "Pioneer-1", "h": "T+11:05 — deployment and first light", "t": "While the booster was still falling, the second stage completed its burn and the payload reached orbit. At T+11:05 the clamp band released and WX-Sat 1 drifted free — deploying a satellite means a spring-loaded ring opens and lets the spacecraft float away at a walking-pace 30 cm per second, slow enough that nothing is damaged and both objects stay in the same orbit. Forty minutes later, on its first pass over the ground station, the satellite called home. Pioneer-1 succeeded at every stage: orbit achieved to within 4 km of target, the booster recovered intact, and the same booster flew again six weeks later. That reflight, more than the launch itself, was the point."}, {"m": "asteria-7", "n": "Asteria-7", "h": "Overview", "t": "OrbitX Heavy carrying sixty satellites at once — the most engines ever lit on a single OrbitX pad, and the mission that made rideshare affordable. Mission 27. Vehicle: OrbitX Heavy. Payload: 60 satellites. Mass to Orbit: 13.4 t. Outcome: Success.", "ov": 1}, {"m": "asteria-7", "n": "Asteria-7", "h": "Why three cores instead of one bigger rocket", "t": "OrbitX Heavy is three OrbitX One first stages bolted together, with a second stage on top: 27 engines firing side by side at liftoff. Building three copies of a proven booster is cheaper and safer than inventing one giant new one — every engine, tank and turbopump is hardware the fleet has already flown, just in triplicate. The trick is that the three cores are not interchangeable during flight. The two side boosters burn hardest and shut down first at T+2:20, so they run out of propellant while the centre core is still full. That stagger is deliberate: it lets the side boosters peel away and fly home while the centre core keeps pushing the payload with a nearly full tank."}, {"m": "asteria-7", "n": "Asteria-7", "h": "The customer isn't one customer — it's sixty", "t": "Asteria-7 was a rideshare mission: sixty different organisations — universities, weather startups, an imaging constellation, three government labs — each bought a slot in one fairing. A small satellite that would once have needed its own $60 million rocket now flies for the price of its own mass, because one launch's fixed costs are shared sixty ways. Before flight, every satellite was mounted to a stack of stacking plates inside the fairing — the clamshell nose cone that protects payloads from wind, rain and acoustic shock. The fairing is jettisoned at about T+3:30, once the air is thin enough that nothing needs protecting; from there on, the satellites ride exposed to space."}, {"m": "asteria-7", "n": "Asteria-7", "h": "Two boosters home, one still flying", "t": "At T+2:20 the side boosters separated and flew a symmetrical ballet: both flipped, both ran boostback burns toward the coast, and both landed on their pads 40 seconds apart. Two boosters, recovered on the same evening, from one mission — that double recovery is what makes the Heavy's economics work. The centre core had a harder job. Still carrying most of the acceleration, it separated at T+3:52 too far downrange to fly back, so it targeted the droneship “Of Course We Still Fly” parked 640 km down the flight path. Landing on a ship in open water means aiming at a deck that rises and falls with the swell — the booster’s landing burn compensates in real time."}, {"m": "asteria-7", "n": "Asteria-7", "h": "T+58:00 — the dispenser starts dealing cards", "t": "Deploying sixty satellites is a schedule, not an event. The stack sits in a dispenser that releases them one at a time, top plate then bottom plate, each pushed away by a spring at 30 cm per second. Releases were spaced about 30 seconds apart so that no two satellites ended up on colliding paths — they separate along the direction of travel, and the tiny speed difference means their orbits drift apart forever. Two of the sixty were intentionally deployed late, an orbit lower, to serve as calibration targets for the others' radios. Every release was confirmed by telemetry before the next one fired; a dispenser that blind-fires sixty payloads is a dispenser that loses sixty payloads."}, {"m": "asteria-7", "n": "Asteria-7", "h": "What the mission proved", "t": "Asteria-7 delivered all sixty payloads into a 540 km orbit with a spread of just 9 km between first and last — tight enough that every customer's satellite reached its operational altitude without spending fuel on corrections. Fuel is lifetime: every kilogram of propellant a satellite saves on orbit correction is months of extra service at the end of its life. Both side boosters flew again within five weeks. The centre core flew again four months later after its droneship landing — the first time an OrbitX Heavy centre core was reflown, and the moment rideshare stopped being a discount option and became the default way to reach orbit."}, {"m": "nova-catch-1", "n": "Nova Catch-1", "h": "Overview", "t": "A 71-metre booster falls from the edge of space and is caught mid-air by the launch tower's arms — no legs, no pad, no landing burn mistakes to recover from. Mission 40. Vehicle: Nova. Payload: Ship test article. Catch altitude: ≈120 m. Outcome: Success.", "ov": 1}, {"m": "nova-catch-1", "n": "Nova Catch-1", "h": "The flight before the catch", "t": "Catch-1 launched at dawn with the Ship carrying a bare test article — no instruments beyond telemetry, because the mission's real payload was data about the booster. Both stages are fully reusable, so unlike every other flight in the fleet, nothing about this launch was disposable: the Ship was headed for a soft splashdown, and the booster for the tower. The 33 VX-Raptor engines lit in three staggered groups over four seconds — a 33-engine ignition is sequenced because lighting them all at once produces a pressure wave that can damage the engines themselves. The rocket cleared the tower at T+0:09, already moving faster than a fighter jet at sea level."}, {"m": "nova-catch-1", "n": "Nova Catch-1", "h": "T+2:40 — hot staging", "t": "Nova separates its stages while the booster's engines are still firing — “hot staging”. The Ship ignites its own engines while vent ports in the booster's top ring let the exhaust escape, so the two vehicles push apart without ever shutting down. It sounds violent, but it keeps acceleration continuous: nothing coasts, nothing has to relight, and the payload keeps a steady ride. The moment the Ship cleared, the booster began its flip — a slow pirouette guided by gimballed engines, turning from engines-first to engines-toward-its-destination in about ten seconds. From this point it is falling, and every remaining manoeuvre is about choosing exactly where it lands."}, {"m": "nova-catch-1", "n": "Nova Catch-1", "h": "The descent — from Mach 6 to a hover", "t": "Reentry is the violent part. The booster fell back into the atmosphere at over six times the speed of sound, its steel skin glowing from the compression heating of air it could not push out of the way. The grid fins — four enormous lattice surfaces taller than a person — steered it through this phase, each one moving under its own hydraulic actuator to trade altitude for lateral distance. The guidance problem is strange: the booster must fall short on purpose. If it aimed exactly at the tower, any small error would be a collision, so it targets a point a few hundred metres to the side and only redirects toward the tower at the last moment, once its accuracy is confirmed. A booster that misses gets redirected to the ocean automatically."}, {"m": "nova-catch-1", "n": "Nova Catch-1", "h": "T+7:31 — the catch", "t": "The final approach is the quietest part of the flight. The booster killed its last velocity with a brief landing burn, then fell the last 200 metres at constant speed past the 145-metre tower. Two mechanical arms — each weighing more than a loaded truck, driven by electric motors — tracked the booster's engine-rail fittings and closed around them at T+7:31. The catch transfers the booster's entire momentum into the tower's structure in under a second; the arms absorb the load with hydraulic dampers, then rotate inward and lower the booster onto the transport stand. Total time from catch to wheels-down on the stand: four minutes. No landing legs were ever attached, and none ever will be."}, {"m": "nova-catch-1", "n": "Nova Catch-1", "h": "What the data said", "t": "The catch point was 2.1 metres from centre — inside the tolerance the arms were built for, and repeatable. Sensors on the arms recorded a peak load of 84% of design capacity, meaning the structure has margin. The booster itself was inspectable within the hour, because it never touched a salt-water ship or a remote pad: it came home to the same building it launched from. Catch-1 is the flight that closes the loop: a booster that launches, returns to the tower it left from, and can theoretically be restacked and flown again within days. The next milestone is the ship — landing 50 metres of spacecraft softly on its own engines, first in the ocean, then back on the tower."}, {"m": "fleet", "n": "OrbitX", "h": "About OrbitX", "t": "OrbitX designs, manufactures and launches the world's most advanced reusable rockets and spacecraft - and trains the crews that fly them.", "th": "OrbitX duniya ke sabse advanced reusable rockets aur spacecraft design, manufacture aur launch karta hai — aur unhe udane wale crews ko train bhi karta hai."}, {"m": "fleet", "n": "OrbitX", "h": "OrbitX One", "t": "OrbitX One is the reusable workhorse rocket: 70 m tall, 3.7 m wide, nine first-stage engines producing 7,600 kN of thrust, and about 22.8 t to low Earth orbit. Its first stage lands and is flown again. Pioneer-1 was its first orbital flight.", "th": "OrbitX One reusable workhorse rocket hai: 70 m lamba, 3.7 m chauda, nau first-stage engines jo 7,600 kN thrust dete hain, aur low Earth orbit tak lagbhag 22.8 t. Iska first stage utarkar dobara udaya jata hai. Pioneer-1 iski pehli orbital udaan thi."}, {"m": "fleet", "n": "OrbitX", "h": "OrbitX Heavy", "t": "OrbitX Heavy is three OrbitX One cores flying as one: 27 engines, 22,800 kN of thrust and about 63.8 t to low Earth orbit - the heaviest payloads in the operational fleet. Asteria-7 was a rideshare flight on OrbitX Heavy.", "th": "OrbitX Heavy teen OrbitX One cores ka ek saath udna hai: 27 engines, 22,800 kN thrust aur low Earth orbit tak lagbhag 63.8 t — hamare fleet ka sabse bhaari payload. Asteria-7 OrbitX Heavy par rideshare flight thi."}, {"m": "fleet", "n": "OrbitX", "h": "Nova", "t": "Nova is the fully reusable super rocket: 121 m tall, 9 m wide, 72,000 kN of thrust and 150 t to orbit. Both stages return, and the 71 m Super Booster (33 methalox engines) is caught by the launch tower instead of landing on legs. Nova Catch-1 was the first catch.", "th": "Nova poori tarah reusable super rocket hai: 121 m lamba, 9 m chauda, 72,000 kN thrust aur 150 t tak orbit payload. Dono stages wapas aate hain, aur 71 m ka Super Booster (33 methalox engines) legs par utarne ke bajay launch tower dwara pakda jata hai. Nova Catch-1 pehla catch tha."}, {"m": "glossary", "n": "Glossary", "h": "Max-Q", "t": "Max-Q is the moment of maximum dynamic pressure on a rocket - when its speed and the thickness of the surrounding air combine to put the greatest aerodynamic stress on the vehicle. Rockets usually throttle down briefly to pass through it safely.", "th": "Max-Q wo pal hai jab rocket par hawa ka dabav (dynamic pressure) sabse zyada hota hai — speed aur hawa ki ghanata milkar sabse zyada aerodynamic stress banate hain. Isliye rocket thodi der ke liye throttle kam kar deta hai."}, {"m": "glossary", "n": "Glossary", "h": "Sun-synchronous orbit (SSO)", "t": "A sun-synchronous orbit is a near-polar orbit tilted so the satellite passes over any point on Earth at the same local solar time every day. Weather and Earth-imaging satellites use it because the lighting stays consistent.", "th": "Sun-synchronous orbit ek near-polar orbit hai jisme satellite Earth ke har point ke upar roz same local solar time par guzarta hai. Weather aur Earth-imaging satellites ise use karte hain kyunki roshni roz ek jaisi rehti hai."}, {"m": "glossary", "n": "Glossary", "h": "Low Earth orbit (LEO)", "t": "Low Earth orbit is an orbit a few hundred kilometres above Earth (up to about 2,000 km). Space stations, crewed capsules and many satellites operate there.", "th": "Low Earth orbit Dharti se kuch sau kilometre (lagbhag 2,000 km tak) upar ki orbit hai. Space stations, crew capsules aur kai satellites yahin chalte hain."}, {"m": "glossary", "n": "Glossary", "h": "Geostationary transfer orbit (GTO)", "t": "A geostationary transfer orbit is an elongated orbit used as a stepping stone to geostationary orbit, about 35,786 km above the equator, where a satellite appears fixed in the sky.", "th": "Geostationary transfer orbit ek lambi, anda-kaar orbit hai jo satellite ko geostationary orbit (equator se ~35,786 km upar) tak pahunchane ke liye use hoti hai, jahan satellite aasman me ek hi jagah tika dikhta hai."}, {"m": "glossary", "n": "Glossary", "h": "Grid fins", "t": "Grid fins are lattice-shaped aerodynamic surfaces that fold out near the top of a booster. They steer the booster through the atmosphere during its descent.", "th": "Grid fins jaali jaise aerodynamic surfaces hain jo booster ke upar ki taraf khulte hain; ye girte waqt hawa me booster ko steer karte hain."}, {"m": "glossary", "n": "Glossary", "h": "Hot staging", "t": "Hot staging means separating a rocket's stages while the lower stage's engines are still firing: the upper stage ignites as the two push apart, which keeps acceleration continuous.", "th": "Hot staging me stages tab alag hote hain jab lower stage ke engines abhi jal rahe hote hain: upper stage jalte hue dono ko dhakel deta hai, isse acceleration beech me tootta nahi."}, {"m": "glossary", "n": "Glossary", "h": "Boostback burn", "t": "A boostback burn turns a booster around and sends it back toward the launch site after stage separation.", "th": "Boostback burn stage separation ke baad booster ko ghuma kar wapas launch site ki taraf bhejne wala burn hai."}, {"m": "glossary", "n": "Glossary", "h": "Droneship", "t": "A droneship is an autonomous ocean-going barge used as a landing platform for boosters that are too far downrange to fly back to land.", "th": "Droneship samundar me chalne wala autonomous barge hai, jis par wo boosters utarte hain jo launch site tak wapas nahi aa sakte."}, {"m": "glossary", "n": "Glossary", "h": "Fairing", "t": "The fairing is the clamshell nose cone that protects a payload from wind, heat and acoustic shock during the first minutes of ascent. It is jettisoned once the air is thin.", "th": "Fairing rocket ki nose cone hai jo do hisson me khulti hai; ye shuruaati minutes me payload ko hawa, garmi aur awaaz ke jhatke se bachati hai aur patli hawa me alag kar di jati hai."}, {"m": "glossary", "n": "Glossary", "h": "Telemetry", "t": "Telemetry is the stream of measurements - engine data, temperatures, positions - sent from a rocket or spacecraft to the ground in real time, used to monitor and later analyse a flight.", "th": "Telemetry wo real-time data hai (engine data, temperature, position) jo rocket ya spacecraft zameen par bhejta hai, taaki flight monitor aur baad me analyse ki ja sake."}, {"m": "glossary", "n": "Glossary", "h": "Methalox", "t": "Methalox is a rocket propellant combination of liquid methane and liquid oxygen. Nova's VX-Raptor engines burn it.", "th": "Methalox liquid methane aur liquid oxygen ka propellant mix hai. Nova ke VX-Raptor engines yahi jalate hain."}, {"m": "glossary", "n": "Glossary", "h": "Kilonewton (kN)", "t": "A kilonewton is a unit of force. One kilonewton is about 102 kg of force; rocket thrust is usually quoted in kN.", "th": "Kilonewton force ki unit hai. 1 kN lagbhag 102 kg ke force ke barabar hota hai; rocket thrust aam taur par kN me bataya jata hai."}, {"m": "glossary", "n": "Glossary", "h": "Rideshare", "t": "A rideshare launch carries many customers on one rocket, splitting the fixed cost of the flight - as on Asteria-7, which carried sixty satellites.", "th": "Rideshare launch me kai customers ek hi rocket baant lete hain, aur launch ka fixed kharcha aapas me bant jata hai — jaise Asteria-7 me 60 satellites."}, {"m": "glossary", "n": "Glossary", "h": "T+ and T- times", "t": "Mission-clock notation: T-0 is liftoff. T+2:28 means two minutes and 28 seconds after liftoff; T-10 means ten seconds before.", "th": "Mission clock: T-0 liftoff ka pal hai. T+2:28 ka matlab liftoff ke 2 minute 28 second baad; T-10 ka matlab liftoff se 10 second pehle."}, {"m": "glossary", "n": "Glossary", "h": "Reusability", "t": "Reusable rockets return their boosters (or whole vehicles) to be inspected and flown again, spreading the build cost over many flights. It is the core idea behind every OrbitX vehicle.", "th": "Reusable rocket ke booster (ya poora vehicle) wapas aakar inspect hote hain aur dobara udte hain, jisse ek rocket ki laagat kai flights me bant jati hai. Har OrbitX vehicle ka yahi mool vichaar hai."}, {"m": "glossary", "n": "Glossary", "h": "Cold-gas thrusters", "t": "Cold-gas thrusters release bursts of compressed gas to rotate or nudge a vehicle without igniting an engine - used, for example, to flip a booster end-for-end after separation.", "th": "Cold-gas thrusters compressed gas ki phoonk se vehicle ko ghumate ya dhakelte hain — engine jalaye bina; booster ko separation ke baad ulta flip karne me yahi kaam aate hain."}, {"m": "glossary", "n": "Glossary", "h": "Mach", "t": "Mach 1 is the speed of sound, roughly 1,200 km/h at sea level. Mach 6 is six times that.", "th": "Mach 1 awaaz ki raftaar hai, sea level par lagbhag 1,200 km/h. Mach 6 uska 6 guna."}, {"m": "glossary", "n": "Glossary", "h": "Orbit insertion", "t": "Orbit insertion is the final burn that gives a payload enough sideways speed to stay in orbit instead of falling back to Earth.", "th": "Orbit insertion wo aakhri burn hai jo payload ko itni sideways speed deta hai ki wo orbit me tika rahe aur zameen par wapas na gire."}, {"m": "glossary", "n": "Glossary", "h": "Stage separation", "t": "Stage separation is the moment a spent rocket stage is released so the next stage can carry the payload on.", "th": "Stage separation wo pal hai jab khatam hua rocket stage alag kiya jata hai taaki agla stage payload ko aage le jaye."}];
  var MISSIONS = {"pioneer-1": {"name": "Pioneer-1", "number": "Mission 1", "url": "pioneer-1.html", "lead": "OrbitX One's first orbital flight: a single reusable booster, one weather satellite, and eleven minutes that proved the whole company.", "stats": [{"v": "OrbitX One", "l": "Vehicle"}, {"v": "WX-Sat 1 (530 kg)", "l": "Payload"}, {"v": "560 km SSO", "l": "Orbit"}, {"v": "Success", "l": "Outcome"}], "leadHi": "OrbitX One ki pehli orbital udaan: ek reusable booster, ek weather satellite, aur gyarah minute jinhone poori company ko sahi sabit kar diya."}, "asteria-7": {"name": "Asteria-7", "number": "Mission 27", "url": "asteria-7.html", "lead": "OrbitX Heavy carrying sixty satellites at once — the most engines ever lit on a single OrbitX pad, and the mission that made rideshare affordable.", "stats": [{"v": "OrbitX Heavy", "l": "Vehicle"}, {"v": "60 satellites", "l": "Payload"}, {"v": "13.4 t", "l": "Mass to Orbit"}, {"v": "Success", "l": "Outcome"}], "leadHi": "OrbitX Heavy ek saath 60 satellites le gaya — ek hi OrbitX pad par sabse zyada engines jalaye gaye, aur isi mission ne rideshare ko sasta bana diya."}, "nova-catch-1": {"name": "Nova Catch-1", "number": "Mission 40", "url": "nova-catch-1.html", "lead": "A 71-metre booster falls from the edge of space and is caught mid-air by the launch tower's arms — no legs, no pad, no landing burn mistakes to recover from.", "stats": [{"v": "Nova", "l": "Vehicle"}, {"v": "Ship test article", "l": "Payload"}, {"v": "≈120 m", "l": "Catch altitude"}, {"v": "Success", "l": "Outcome"}], "leadHi": "71 metre ka booster space ke kinare se girta hai aur launch tower ki baahon me hawa me hi pakad liya jata hai — na legs, na pad, na landing burn ki galti sudharne ka mauka."}};
  var SUGGEST = {"pioneer-1": ["Why a sun-synchronous orbit?", "How did the booster land?", "What happened at T+11:05?"], "asteria-7": ["How many satellites were deployed?", "Why three cores?", "Where did the centre core land?"], "nova-catch-1": ["What is hot staging?", "How is the booster caught?", "What did the data say?"]};
  var SUGGEST_HI = {"pioneer-1": ["Booster kaise utra?", "Sun-synchronous orbit kyun chuni?", "Launch kitne baje hua?"], "asteria-7": ["Kitne satellites chhode gaye?", "Teen cores kyun?", "Centre core kahan utra?"], "nova-catch-1": ["Catch kaise hua?", "Launch me kitna time laga?", "Hot staging kya hai?"]};
  var FAQ = [{"m": "pioneer-1", "s": "Timeline", "re": "how long|duration|took|taking|total time|kitna time|kitni der|kitna samay|time (lag|lga|laga)|\\blag(a|ta|ega|ti)\\b|\\blga\\b|complete|compelet|\\bpoora\\b|\\bpura\\b|khatam|how many minutes", "en": "The booster landed 8 minutes 47 seconds after liftoff (T+8:47), and the satellite WX-Sat 1 was released at T+11:05. About 40 minutes later, on its first pass over the ground station, the satellite called home.", "hi": "Booster liftoff ke 8 minute 47 second baad (T+8:47) khud zameen par utar gaya, aur WX-Sat 1 satellite T+11:05 par alag hua. Lagbhag 40 minute baad, ground station ke upar apni pehli pass me satellite ne sampark kiya."}, {"m": "pioneer-1", "s": "T−0 — a night launch", "re": "what time|\\bkab\\b|kitne baje|\\bbaje\\b|local time|countdown|02:41|when (did|was).*(launch|lift)|night", "en": "Pioneer-1's countdown reached zero at 02:41 local time — a night launch. The mission had a 12-minute launch window that repeated once per day.", "hi": "Pioneer-1 ka countdown local time ke hisaab se raat 02:41 par zero hua — yaani ye night launch tha. Launch ka window sirf 12 minute ka tha jo roz ek baar aata tha."}, {"m": "pioneer-1", "s": "Reflight", "re": "reflight|flew again|fly again|again|dobara|phir se|reuse|reflown", "en": "Yes — the same booster flew again six weeks later. That reflight, more than the launch itself, was the point of the mission.", "hi": "Haan — wahi booster chhe hafte baad dobara udaan bhar gaya. Mission ka asli maqsad launch se zyada yahi reflight tha."}, {"m": "pioneer-1", "s": "What the mission proved", "re": "success|result|outcome|safal|kamyab|succeed|worked|how did.*go|target", "en": "Pioneer-1 succeeded at every stage: orbit achieved to within 4 km of the target, the booster recovered intact, and the same booster flew again six weeks later.", "hi": "Pioneer-1 har stage par safal raha: orbit target se sirf 4 km door thi, booster salamat wapas aaya, aur wahi booster chhe hafte baad dobara udaya gaya."}, {"m": "pioneer-1", "s": "The mission in one sentence", "re": "\\bsso\\b|sun.?synchronous|\\borbit\\b|kaksha|560", "en": "The target was a 560 km sun-synchronous orbit: it is tilted so the satellite crosses every point on Earth at the same local solar time — essential for weather cameras, which need consistent lighting every day. Reaching it demands a launch almost straight south over the ocean, so the mission had a 12-minute window once per day.", "hi": "Target 560 km ki sun-synchronous orbit thi. Isme satellite Earth ke har point ke upar roz same local solar time par guzarta hai — weather cameras ko roz ek jaisi roshni chahiye, isliye ye orbit chuni gayi. Isme pahunchne ke liye rocket ko ocean ke upar lagbhag seedha south ki taraf chhodna padta hai, isliye window roz sirf 12 minute ka tha."}, {"m": "pioneer-1", "s": "The mission in one sentence", "re": "payload|wx.?sat|weather|satellite|upgrah|carry|carried|le gaya", "en": "The payload was WX-Sat 1, a deliberately simple weather-imaging satellite (530 kg), delivered to a 560 km sun-synchronous orbit.", "hi": "Payload WX-Sat 1 tha — ek jaanboojh kar simple rakha gaya weather-imaging satellite (530 kg), jise 560 km ki sun-synchronous orbit me pahunchaya gaya."}, {"m": "pioneer-1", "s": "Two minutes in — separation", "re": "separat|\\bstage\\b|2:28|alag", "en": "Stage separation happened at T+2:28: the first stage shut down, the second stage ignited a fraction of a second later, and three pneumatic pushers shoved the stages apart gently. The booster then flipped end-for-end with cold-gas thrusters and began its descent.", "hi": "Stage separation T+2:28 par hua: pehla stage band hua, doosra stage kuch hi pal baad jala, aur teen pneumatic pushers ne dono stages ko aaram se alag kiya. Uske baad booster cold-gas thrusters se ulta mudha aur neeche girna shuru kiya."}, {"m": "pioneer-1", "s": "T+8:47 — the booster lands itself", "re": "land|utar|touch|booster|grid fin|accura|60 m|\\bpad\\b", "en": "The booster landed itself at T+8:47 on a concrete pad barely 60 metres across — 1.8 metres from the centre. It steers down with four grid fins and relights one engine below 3 km for the final burn.", "hi": "Booster T+8:47 par khud utra — sirf 60 metre chaude concrete pad par, centre se sirf 1.8 metre door. Girte waqt wo 4 grid fins se steer karta hai aur 3 km se neeche ek engine dobara jalakar aakhri burn karta hai."}, {"m": "asteria-7", "s": "Timeline", "re": "how long|duration|took|taking|total time|kitna time|kitni der|kitna samay|time (lag|lga|laga)|\\blag(a|ta|ega|ti)\\b|\\blga\\b|complete|compelet|\\bpoora\\b|\\bpura\\b|khatam|how many minutes|timeline|schedule|t\\+|\\bkab\\b|when", "en": "Key times: the side boosters separate at T+2:20, the fairing is jettisoned at about T+3:30, the centre core separates at T+3:52, and satellite deployment starts at T+58:00 (one satellite roughly every 30 seconds).", "hi": "Mukhya time: T+2:20 par side boosters alag hote hain, lagbhag T+3:30 par fairing alag hoti hai, T+3:52 par centre core alag hota hai, aur T+58:00 se satellites ek-ek karke (lagbhag har 30 second me) chhode gaye."}, {"m": "asteria-7", "s": "The customer isn’t one customer — it’s sixty", "re": "cost|price|dollar|\\$|million|cheap|sasta|kharch|kimat|paisa|afford", "en": "A small satellite that once needed its own $60 million rocket now flies for the price of its own mass, because the launch's fixed costs are shared sixty ways.", "hi": "Jo chhota satellite pehle apne alag rocket par $60 million kharch karta tha, ab sirf apne wazan ke hisaab se paisa deta hai, kyunki ek launch ka fixed kharcha 60 customers me baant diya jata hai."}, {"m": "asteria-7", "s": "What the mission proved", "re": "reflight|flew again|fly again|again|dobara|phir se|reuse|reflown", "en": "Both side boosters flew again within five weeks. The centre core flew again four months later after its droneship landing — the first time an OrbitX Heavy centre core was reflown.", "hi": "Dono side boosters paanch hafte ke andar dobara udaan bhar gaye. Centre core droneship landing ke chaar mahine baad dobara udaya gaya — ye OrbitX Heavy ke centre core ka pehla reflight tha."}, {"m": "asteria-7", "s": "Why three cores instead of one bigger rocket", "re": "\\bcores\\b|three|\\b3\\b|27|teen", "en": "OrbitX Heavy is three OrbitX One first stages bolted together (27 engines): building three copies of a proven booster is cheaper and safer than inventing one giant new rocket. The side boosters shut down first so they can peel away and fly home while the centre core keeps pushing the payload with a nearly full tank.", "hi": "OrbitX Heavy me OrbitX One ke teen first stages jude hain (27 engines): ek bahut bada naya rocket banane se behtar hai ek parakhe hue booster ki teen copies banana — sasta bhi, surakshit bhi. Side boosters pehle band hote hain taaki wo alag hokar wapas aa sakein, jabki centre core lagbhag bhare tank ke saath payload ko dhakelta rehta hai."}, {"m": "asteria-7", "s": "The customer isn’t one customer — it’s sixty", "re": "how many|kitne|kitni|number of|count|total|\\b60\\b|sixty|customers?", "en": "Asteria-7 carried 60 satellites from 60 different organisations (13.4 t in total) and delivered all of them into a 540 km orbit with a spread of just 9 km between the first and the last.", "hi": "Asteria-7 ne 60 alag-alag organisations ke 60 satellites (kul 13.4 t) ek saath le jaakar 540 km ki orbit me chhode — pehle aur aakhri satellite ke beech sirf 9 km ka fark tha."}, {"m": "asteria-7", "s": "T+58:00 — the dispenser starts dealing cards", "re": "dispenser|spring|how fast|speed|raftaar|one at a time|ek.?ek|release|deploy|chhod", "en": "The satellites sit in a dispenser and are released one at a time, each pushed away by a spring at 30 cm per second, about 30 seconds apart, starting at T+58:00. Two of the sixty were deliberately deployed late, an orbit lower, as calibration targets.", "hi": "Satellites ek dispenser me rakhe the aur ek-ek karke chhode gaye — har ek ko spring 30 cm/sec ki raftaar se dhakelti hai, lagbhag har 30 second par, T+58:00 se shuru. 60 me se 2 satellites jaanboojhkar der se, ek orbit neeche, calibration targets ke roop me chhode gaye."}, {"m": "asteria-7", "s": "Two boosters home, one still flying", "re": "booster|centre|center|droneship|land|utar|\\bside\\b|ship", "en": "Both side boosters flew home and landed on their pads 40 seconds apart. The centre core separated at T+3:52, too far downrange to return, so it landed on the droneship “Of Course We Still Fly”, 640 km down the flight path.", "hi": "Dono side boosters wapas aaye aur 40 second ke gap par apne pads par utre. Centre core T+3:52 par itni door alag hua ki wapas nahi aa sakta tha, isliye wo 640 km door khadi droneship “Of Course We Still Fly” par utra."}, {"m": "asteria-7", "s": "What the mission proved", "re": "success|result|orbit|540|spread|proved|safal|outcome", "en": "Asteria-7 delivered all sixty payloads into a 540 km orbit with a spread of just 9 km, so every customer's satellite reached its operating altitude without spending fuel on corrections. Both side boosters and later the centre core flew again.", "hi": "Asteria-7 ne saare 60 payloads 540 km ki orbit me sirf 9 km ke spread ke saath pahunchaye, isliye har customer ka satellite bina fuel kharch kiye apni operating altitude par pahunch gaya. Dono side boosters aur baad me centre core ne bhi dobara udaan bhari."}, {"m": "nova-catch-1", "s": "Timeline", "re": "how long|duration|took|taking|total time|kitna time|kitni der|kitna samay|time (lag|lga|laga)|\\blag(a|ta|ega|ti)\\b|\\blga\\b|complete|compelet|\\bpoora\\b|\\bpura\\b|khatam|how many minutes", "en": "The catch happened at T+7:31 — about seven and a half minutes after liftoff. The rocket cleared the tower at T+0:09, hot staging was at T+2:40, and from the catch to wheels-down on the transport stand took four more minutes.", "hi": "Catch T+7:31 par hua — yaani liftoff ke lagbhag saade saat minute baad. Rocket T+0:09 par tower se bahar nikla, hot staging T+2:40 par hui, aur catch se transport stand par rakhne tak 4 minute aur lage."}, {"m": "nova-catch-1", "s": "What the data said", "re": "\\bnext\\b|milestone|future|\\baage\\b|agla|ship landing", "en": "The next milestone is the Ship: landing 50 metres of spacecraft softly on its own engines — first in the ocean, then back on the tower.", "hi": "Agla milestone Ship hai: 50 metre lambe spacecraft ko apne hi engines par naram landing karana — pehle samundar me, phir wapas tower par."}, {"m": "nova-catch-1", "s": "What the data said", "re": "accura|precis|\\bdata\\b|centre|center|2\\.1|\\b84\\b|tolerance|peak load|sensor", "en": "The catch point was 2.1 metres from the centre, inside the tolerance the arms were built for. Sensors recorded a peak load of 84% of design capacity, so the structure has margin, and the booster could be inspected within the hour.", "hi": "Catch point centre se sirf 2.1 metre door tha, yaani arms ki tolerance ke andar. Sensors ne arms par peak load design capacity ka 84% record kiya, yaani structure me margin hai, aur booster ki inspection ek ghante ke andar ho gayi."}, {"m": "nova-catch-1", "s": "The flight before the catch", "re": "payload|test article|\\bship\\b|carry|carried|le gaya|kya le", "en": "The Ship carried a bare test article with no instruments beyond telemetry — the mission's real payload was data about the booster. Both stages are reusable, so nothing about this launch was disposable.", "hi": "Ship me sirf ek khaali test article tha, telemetry ke alawa koi instrument nahi — mission ka asli payload booster ke baare me data tha. Dono stages reusable hain, isliye is launch me kuch bhi fenka nahi gaya."}, {"m": "nova-catch-1", "s": "The flight before the catch", "re": "engines?|raptor|\\b33\\b|ignit|injan", "en": "The 33 VX-Raptor engines lit in three staggered groups over four seconds — lighting them all at once would produce a pressure wave that can damage the engines. The rocket cleared the tower at T+0:09.", "hi": "33 VX-Raptor engines chaar second me teen groups me baari-baari se jale — sab ek saath jalane se ek pressure wave banti hai jo engines ko nuksan pahuncha sakti hai. Rocket T+0:09 par tower se bahar nikla."}, {"m": "nova-catch-1", "s": "T+7:31 — the catch", "re": "\\blegs?\\b|why no|without|bina legs", "en": "Landing legs cost mass and complicate reuse, so Nova's booster has none: every kilogram goes to performance, and turnaround is the fastest possible — the booster can be restacked for its next flight within days.", "hi": "Landing legs wazan badhate hain aur reuse ko mushkil banate hain, isliye Nova ke booster me legs hain hi nahi: har kilogram performance me lagta hai, aur turnaround sabse tez hota hai — booster kuch hi dinon me agli udaan ke liye dobara stack ho sakta hai."}, {"m": "nova-catch-1", "s": "T+2:40 — hot staging", "re": "hot staging|staging|separat|alag", "en": "Nova separates its stages while the booster's engines are still firing (“hot staging”, at T+2:40). The Ship ignites while vent ports in the booster's top ring let the exhaust escape, so acceleration stays continuous and the payload gets a steady ride. The booster then flips in about ten seconds.", "hi": "Nova me stages tab alag hote hain jab booster ke engines abhi bhi jal rahe hote hain (“hot staging”, T+2:40 par). Ship ke engines jalte hain aur booster ke upar ke ring ke vent ports se exhaust nikal jata hai, isliye acceleration beech me tootta nahi aur payload ko jhatke nahi lagte. Uske baad booster lagbhag 10 second me ulta flip karta hai."}, {"m": "nova-catch-1", "s": "The descent — from Mach 6 to a hover", "re": "descent|reentry|re-entry|mach|grid fin|\\bfall|miss", "en": "The booster reenters at over six times the speed of sound, its steel skin glowing, and steers with four huge grid fins. It deliberately aims a few hundred metres to the side of the tower and only redirects toward it at the last moment, once its accuracy is confirmed — a booster that misses gets redirected to the ocean automatically.", "hi": "Booster awaaz ki raftaar se 6 guna tez gati par wapas atmosphere me ghusta hai, uski steel ki chamdi tapkar damakti hai, aur wo chaar bade grid fins se steer karta hai. Wo jaanboojhkar tower se kuch sau metre side me nishana lagata hai aur aakhri pal me, accuracy pakki hone par hi tower ki taraf mudta hai — jo booster chook jaye use apne aap samundar ki taraf mod diya jata hai."}, {"m": "nova-catch-1", "s": "T+7:31 — the catch", "re": "catch|caught|\\barms?\\b|pakd|tower", "en": "Two mechanical arms (each heavier than a loaded truck) tracked the booster's engine-rail fittings and closed around them at T+7:31. The arms absorbed the load with hydraulic dampers, then rotated inward and lowered the booster onto the transport stand.", "hi": "Do mechanical arms (har ek loaded truck se bhari) ne booster ke engine-rail fittings ko track kiya aur T+7:31 par unke around band ho gayi. Arms ne hydraulic dampers se jhatka sokha, phir andar ki taraf ghoom kar booster ko transport stand par utaar diya."}];
  var pageMission = document.body.getAttribute('data-mission') || '';

  /* ---------- Hindi / Hinglish ---------- */
  var DEV = {
    '\u0915\u093f\u0924\u0928\u093e': 'how much', '\u0915\u093f\u0924\u0928\u0947': 'how many', '\u0915\u093f\u0924\u0928\u0940': 'how many',
    '\u0938\u092e\u092f': 'time', '\u0915\u092c': 'when', '\u0915\u094d\u092f\u094b\u0902': 'why', '\u0915\u0948\u0938\u0947': 'how',
    '\u0915\u0939\u093e\u0901': 'where', '\u0915\u0939\u093e\u0902': 'where', '\u0915\u094d\u092f\u093e': 'what',
    '\u0932\u0949\u0928\u094d\u091a': 'launch', '\u0932\u093e\u0902\u091a': 'launch', '\u0909\u092a\u0917\u094d\u0930\u0939': 'satellite',
    '\u0938\u0948\u091f\u0947\u0932\u093e\u0907\u091f': 'satellite', '\u0915\u0915\u094d\u0937\u093e': 'orbit', '\u0911\u0930\u094d\u092c\u093f\u091f': 'orbit',
    '\u0907\u0902\u091c\u0928': 'engine', '\u0930\u0949\u0915\u0947\u091f': 'rocket', '\u092c\u0942\u0938\u094d\u091f\u0930': 'booster',
    '\u092e\u093f\u0936\u0928': 'mission', '\u0932\u0948\u0902\u0921\u093f\u0902\u0917': 'landing', '\u0909\u0924\u0930\u093e': 'land',
    '\u0909\u0924\u0930\u0947': 'land', '\u0909\u0924\u0930\u0928\u093e': 'land', '\u092a\u0915\u0921\u093c\u093e': 'catch', '\u092a\u0915\u0921\u093c': 'catch',
    '\u091f\u093e\u0935\u0930': 'tower', '\u092a\u0939\u0932\u0940': 'first', '\u092a\u0939\u0932\u093e': 'first', '\u0909\u0921\u093c\u093e\u0928': 'flight',
    '\u0938\u092b\u0932': 'success', '\u0932\u093e\u0917\u0924': 'cost', '\u0915\u0940\u092e\u0924': 'cost', '\u0916\u0930\u094d\u091a': 'cost',
    '\u090a\u0902\u091a\u093e\u0908': 'altitude', '\u0917\u0924\u093f': 'speed', '\u0930\u092b\u094d\u0924\u093e\u0930': 'speed',
    '\u0926\u094b\u092c\u093e\u0930\u093e': 'again', '\u0905\u0932\u0917': 'separate', '\u092a\u0947\u0932\u094b\u0921': 'payload',
    '\u0939\u0949\u091f \u0938\u094d\u091f\u0947\u091c\u093f\u0902\u0917': 'hot staging', '\u0915\u094b\u0930': 'core',
    '\u0928\u094b\u0935\u093e': 'nova', '\u0915\u0948\u091a': 'catch', '\u092a\u093e\u092f\u0928\u093f\u092f\u0930': 'pioneer', '\u090f\u0938\u094d\u091f\u0947\u0930\u093f\u092f\u093e': 'asteria',
    '\u0932\u0917\u093e': 'lga', '\u0932\u0917\u0924\u093e': 'lga', '\u0932\u0917\u0947': 'lga', '\u0939\u0949\u091f': 'hot', '\u0938\u094d\u091f\u0947\u091c\u093f\u0902\u0917': 'staging', '\u0939\u0948': 'hai'
  };
  var DEV_KEYS = Object.keys(DEV).sort(function (a, b) { return b.length - a.length; });
  var HIN_MARK = /\b(kya|kitna|kitne|kitni|kab|kaise|kese|kyun|kyu|kahan|kaun|hai|hain|hua|hui|hone|lga|laga|lagta|lagega|batao|bataiye|btao|samjhao|mujhe|nahi|ka|ki|ko|ke|mein|gaya|gaye|kiya|karo|utra|utre|pakda|chhode|baje|der|samay|waqt|dobara|teen|zyada|jyada|namaste|namaskar|shukriya|dhanyavaad|dhanyawad|dhanyavad)\b/;

  function detectLang(q) { return /[\u0900-\u097F]/.test(q) || HIN_MARK.test(q.toLowerCase()) ? 'hi' : 'en'; }
  function normalize(q) {
    var s = String(q).toLowerCase();
    DEV_KEYS.forEach(function (k) { if (s.indexOf(k) > -1) s = s.split(k).join(' ' + DEV[k] + ' '); });
    return s.replace(/\s+/g, ' ').trim();
  }

  /* ---------- text helpers ---------- */
  var STOP = {};
  ('a an the and or of to in on at for with from by is are was were be been being it its this that these those as but if so do does did how what when where which who whom why can could would should will about into than then there their they them he she you your i me my we our us not no yes tell please give say any some more most also just very much many ' +
   'kya hai hain kab kaise kese kyun kyu kitna kitne kitni ka ke ki mein se ko batao bataiye btao hota hota hoti hote hua hui hue tha thi m me hone lga laga lagta lagega lagti gaya gaye gayi kiya kiye kare karo karna chahiye mujhe aap tum tumhe yeh ye wo woh par pe aur ya bhi toh nahi kuch sab poochiye pucho samjhao samjhaiye kahan kaun ho').split(' ').forEach(function (w) { STOP[w] = 1; });

  var SYN = {
    liftoff: 'launch', lifted: 'launch', touchdown: 'land', touched: 'land', cheap: 'cost', cheaper: 'cost',
    price: 'cost', prices: 'cost', affordable: 'cost', expensive: 'cost', money: 'cost', dollars: 'cost',
    succeeded: 'success', succeed: 'success', successful: 'success', failed: 'fail', failure: 'fail',
    sats: 'satellite', sat: 'satellite', sixty: '60', nine: '9', twelve: '12', thirty: '30', forty: '40',
    fifty: '50', twenty: '20', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8',
    ten: '10', hundred: '100', caught: 'catch', catching: 'catch', arms: 'arm', fins: 'fin',
    recovered: 'recover', reflown: 'reflight', reflew: 'reflight', reflights: 'reflight', reused: 'reuse',
    reusable: 'reuse', reusability: 'reuse', centre: 'center', metres: 'meter', metre: 'meter', kilometres: 'km',
    kilometre: 'km', kilograms: 'kg', tonnes: 'tonne', fall: 'descent', falling: 'descent', fell: 'descent',
    /* Hinglish -> English */
    der: 'time', samay: 'time', waqt: 'time', pakda: 'catch', pakad: 'catch', pakadna: 'catch', pakde: 'catch',
    utra: 'land', utre: 'land', utri: 'land', utarna: 'land', utarta: 'land', kaksha: 'orbit', injan: 'engine',
    raket: 'rocket', udaan: 'flight', uddan: 'flight', safal: 'success', safalta: 'success', kamyab: 'success',
    kharcha: 'cost', kharch: 'cost', kimat: 'cost', keemat: 'cost', lagat: 'cost', paisa: 'cost', sasta: 'cost',
    unchai: 'altitude', oonchai: 'altitude', raftaar: 'speed', raftar: 'speed', gati: 'speed', pehla: 'first',
    pehli: 'first', pehle: 'first', dobara: 'reflight', phirse: 'reflight', alag: 'separate', chhode: 'deploy',
    chhoda: 'deploy', chhodna: 'deploy', compelet: 'complete', complet: 'complete', poora: 'complete', pura: 'complete',
    khatam: 'complete', teen: '3', char: '4', paanch: '5', chhe: '6', saat: '7', aath: '8', nau: '9', das: '10',
    satelite: 'satellite', upgrah: 'satellite', baje: 'time'
  };

  function stem(x) { return x.length > 4 ? x.replace(/(ing|ed|ly|es|s|e)$/, '') : x; }

  function tokens(s) {
    s = String(s).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, '-').replace(/['\u2019]s\b/g, '').replace(/['\u2019\u201c\u201d"]/g, '');
    var raw = s.match(/[a-z0-9]+(?:[+:.\-][a-z0-9]+)*/g) || [], out = [];
    raw.forEach(function (w) {
      var parts = /[+:.\-]/.test(w) ? w.split(/[+:.\-]/).filter(Boolean) : [];
      [w].concat(parts).forEach(function (x) {
        x = SYN[x] || x;
        if (STOP[x] || (x.length < 2 && !/\d/.test(x))) return;
        out.push(stem(x));
      });
    });
    return out;
  }
  function unique(a) { var o = {}, r = []; a.forEach(function (x) { if (!o[x]) { o[x] = 1; r.push(x); } }); return r; }

  /* ---------- index ---------- */
  var N = KB.length, DF = {};
  KB.forEach(function (c) {
    c.set = {}; c.hk = {}; c.bg = {}; c.tf = {};
    var tk = tokens(c.t + ' ' + c.h + ' ' + c.h);
    tk.forEach(function (x, i) { c.set[x] = 1; c.tf[x] = (c.tf[x] || 0) + 1; if (i) c.bg[tk[i - 1] + ' ' + x] = 1; });
    c.hl = unique(tokens(c.h));
    c.hl.forEach(function (x) { c.hk[x] = 1; });
    Object.keys(c.set).forEach(function (x) { DF[x] = (DF[x] || 0) + 1; });
  });
  function idf(x) { return Math.log(1 + N / (DF[x] || 0.5)); }
  var VOCAB = Object.keys(DF);

  // typo tolerance: 'satelite' -> 'satellit', 'boster' -> 'booster'
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  // spelling fix on whole words ('boster' -> 'booster') so the Q&A patterns still match
  var RAWV = {};
  KB.forEach(function (c) { (String(c.t + ' ' + c.h).toLowerCase().match(/[a-z]{5,}/g) || []).forEach(function (w) { RAWV[w] = 1; }); });
  var RAWL = Object.keys(RAWV);
  function spell(s) {
    return s.replace(/[a-z]{5,}/g, function (w) {
      if (RAWV[w] || SYN[w] || STOP[w]) return w;
      var best = null;
      RAWL.forEach(function (v) { if (!best && v[0] === w[0] && Math.abs(v.length - w.length) <= 1 && lev(w, v) <= 1) best = v; });
      return best || w;
    });
  }

  function fix(x) {
    if (DF[x] || x.length < 5 || /\d/.test(x)) return x;
    var best = null;
    VOCAB.forEach(function (v) { if (Math.abs(v.length - x.length) <= 1 && lev(x, v) <= 1 && (!best || DF[v] > DF[best])) best = v; });
    return best || x;
  }

  var MD = {
    'pioneer-1': /pioneer|mission 1\b|wx-?sat|weather|sun-?synchronous|\bsso\b/,
    'asteria-7': /asteria|mission 27|rideshare|dispenser|sixty|60 sat|centre core|center core|side booster|droneship|heavy/,
    'nova-catch-1': /nova|catch|caught|mission 40|hot staging|raptor|test article/
  };
  var NAME_RE = { 'pioneer-1': /pioneer-?\s?1|mission\s*1\b/, 'asteria-7': /asteria-?\s?7|mission\s*27\b/, 'nova-catch-1': /nova[\s-]?catch(?:-?\s?1)?|catch-?\s?1|mission\s*40\b/ };
  FAQ.forEach(function (f) { f.rx = new RegExp(f.re, 'i'); });

  /* ---------- retrieval ---------- */
  function search(qn) {
    var qt = tokens(qn).map(fix), qset = {};
    qt.forEach(function (x) { qset[x] = 1; });
    var qu = Object.keys(qset);
    if (!qu.length) return { res: [], qset: qset, det: [] };
    var det = [];
    Object.keys(MD).forEach(function (k) { if (MD[k].test(qn)) det.push(k); });
    var timeQ = /\b(when|what time|time|kab)\b/.test(qn);
    var res = KB.map(function (c) {
      var s = 0, hit = 0;
      qu.forEach(function (x) { if (c.set[x]) { s += idf(x) * (1 + 0.5 * Math.log(c.tf[x])) * (c.hk[x] ? 1.6 : 1); hit++; } });
      for (var i = 1; i < qt.length; i++) { if (c.bg[qt[i - 1] + ' ' + qt[i]]) s += 1.5; }
      if (c.ov) s *= 0.6;
      if (timeQ && /\d{1,2}:\d{2}/.test(c.t)) s *= 1.4;
      var raw = s;
      if (c.m === 'glossary' || c.m === 'fleet') {
        var cov = 0; c.hl.forEach(function (x) { if (qset[x]) cov++; });
        if (c.hl.length && cov / c.hl.length >= 0.6) s += 6;
      } else if (det.length) {
        if (det.indexOf(c.m) > -1) s *= 2.2;
      } else if (c.m === pageMission) { s *= 1.5; }
      return { c: c, s: s, raw: raw, hit: hit };
    }).filter(function (r) { return r.raw > 0; }).sort(function (a, b) { return b.s - a.s; });
    return { res: res, qset: qset, det: det };
  }

  function sentences(t) { return t.replace(/([.!?])\s+(?=[A-Z0-9\u201c"])/g, '$1\u0001').split('\u0001'); }

  function pick(c, qset, lang) {
    if (lang === 'hi' && c.th) return c.th;
    if (c.m === 'glossary' || c.m === 'fleet' || c.ov) return c.t;
    var ss = sentences(c.t);
    var sc = ss.map(function (s, i) {
      var seen = {}, v = 0;
      tokens(s).forEach(function (x) { if (qset[x] && !seen[x]) { seen[x] = 1; v += idf(x); } });
      return { i: i, s: s, v: v };
    });
    var ranked = sc.slice().sort(function (a, b) { return b.v - a.v; });
    if (!ranked[0] || ranked[0].v === 0) return ss.slice(0, 2).join(' ');
    var chosen = {};
    chosen[ranked[0].i] = 1;
    for (var k = 1; k < 3; k++) { if (ranked[k] && ranked[k].v > 0 && ranked[k].v >= ranked[0].v * 0.5) chosen[ranked[k].i] = 1; }
    Object.keys(chosen).forEach(function (i) { i = +i; if (ss[i].length < 60 && ss[i + 1]) chosen[i + 1] = 1; });   // short sentence -> add context
    var out = [], len = 0;
    Object.keys(chosen).map(Number).sort(function (a, b) { return a - b; }).forEach(function (i) {
      if (!out.length || len + ss[i].length <= 520) { out.push(ss[i]); len += ss[i].length; }
    });
    return out.join(' ');
  }

  function srcOf(c) {
    var label = c.m === 'glossary' ? 'Glossary \u00b7 ' + c.h : c.m === 'fleet' ? 'OrbitX fleet \u00b7 ' + c.h : c.n + ' \u00b7 ' + c.h;
    var url = MISSIONS[c.m] && c.m !== pageMission ? MISSIONS[c.m].url : '';
    return { label: label, url: url };
  }

  function chipsFor(m, lang) {
    var S = lang === 'hi' ? SUGGEST_HI : SUGGEST;
    var base = S[m] || [].concat(S['pioneer-1'].slice(0, 1), S['asteria-7'].slice(0, 1), S['nova-catch-1'].slice(0, 1));
    return base.concat([lang === 'hi' ? 'Teeno missions compare karo' : 'Compare all three missions']).slice(0, 4);
  }
  function T(lang, en, hi) { return lang === 'hi' ? hi : en; }

  function listAnswer(lang) {
    var items = Object.keys(MISSIONS).map(function (k) {
      var m = MISSIONS[k];
      return { t: m.name + ' (' + m.number + ')', b: m.stats.map(function (s) { return s.v; }).join(' \u00b7 '), s: lang === 'hi' ? m.leadHi : m.lead, u: m.url };
    });
    return { text: T(lang, 'Here are the three launches on this site:', 'Is site ke teeno launches ye hain:'), list: items, chips: chipsFor(pageMission, lang) };
  }

  function overview(k, lang) {
    var m = MISSIONS[k];
    return {
      text: lang === 'hi' ? m.leadHi : m.lead, list: m.stats.map(function (s) { return { t: s.l, b: s.v }; }),
      src: { label: m.name + ' \u00b7 ' + m.number, url: k !== pageMission ? m.url : '' }, chips: chipsFor(k, lang)
    };
  }

  /* ---------- local "AI" ---------- */
  function local(q) {
    var lang = detectLang(q), qn = spell(normalize(q)), words = qn.split(/\s+/);

    if (/^(hi+|hello|hey+|yo|namaste|namaskar|good (morning|afternoon|evening))\b/.test(qn) && words.length <= 4)
      return { text: T(lang, 'Hi! I\u2019m the OrbitX mission assistant. Ask me anything about Pioneer-1, Asteria-7 or Nova Catch-1 \u2014 in English, Hindi or Hinglish.',
        'Namaste! Main OrbitX mission assistant hoon. Pioneer-1, Asteria-7 ya Nova Catch-1 ke baare me kuch bhi poochiye \u2014 Hindi, Hinglish ya English me.'), chips: chipsFor(pageMission, lang) };
    if (/\b(thanks|thank you|thx|shukriya|dhanyavaad|dhanyawad|dhanyavad)\b/.test(qn))
      return { text: T(lang, 'You\u2019re welcome! Ask me anything else about the missions.', 'Koi baat nahi! Missions ke baare me aur kuch poochna ho to bataiye.'), chips: chipsFor(pageMission, lang) };
    if ((/\b(who are you|what are you|what can you do|tum kaun|aap kaun|kya kar sakte)\b|^help\b/.test(qn)) && words.length <= 6)
      return { text: T(lang, 'I\u2019m the OrbitX mission assistant. I can explain how each launch went, what each vehicle did, key numbers and rocket terms (like max-Q, hot staging or sun-synchronous orbit).',
        'Main OrbitX mission assistant hoon. Main bata sakta hoon ki har launch kaise hua, vehicles ne kya kiya, mukhya numbers, aur rocket ke terms (jaise max-Q, hot staging ya sun-synchronous orbit).'), chips: chipsFor(pageMission, lang) };
    if (/\b(compare|comparison|difference|farak|versus|vs)\b/.test(qn) || /\b(all|list|every|three|each|teeno|sabhi|saare)\b.*\b(missions?|launch(es)?)\b/.test(qn))
      return listAnswer(lang);

    // single mission name only -> overview
    var named = Object.keys(NAME_RE).filter(function (k) { return NAME_RE[k].test(qn); });
    if (named.length === 1) {
      var rest = qn.replace(/pioneer-?\s?1|asteria-?\s?7|nova[\s-]?catch(?:-?\s?1)?|catch-?\s?1|mission\s*(1|27|40)/g, ' ').replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(function (w) {
        return w && !STOP[w] && !/^(mission|overview|summary|about|tell|describe|explain|story|details?|info|information|baare|bare|batao)$/.test(w);
      });
      if (!rest.length) return overview(named[0], lang);
    }

    // "what is ..." questions about a rocket term -> glossary first
    if (/\b(what|define|meaning|kya|explain|samjhao)\b/.test(qn)) {
      var g = search(qn);
      if (g.res[0] && (g.res[0].c.m === 'glossary' || g.res[0].c.m === 'fleet') && g.res[0].s >= 6) return fromResult(g, lang, q);
    }

    // curated Q&A
    var det = [];
    Object.keys(MD).forEach(function (k) { if (MD[k].test(qn)) det.push(k); });
    if (det.length <= 1) {
      var target = det[0] || pageMission;
      var hit = FAQ.filter(function (f) { return f.m === target; }).filter(function (f) { return f.rx.test(qn); })[0];
      if (hit) {
        return { text: T(lang, hit.en, hit.hi), src: { label: MISSIONS[hit.m].name + ' \u00b7 ' + hit.s, url: hit.m !== pageMission ? MISSIONS[hit.m].url : '' }, chips: chipsFor(hit.m, lang).filter(function (c) { return c.toLowerCase().replace(/\?$/, '') !== q.toLowerCase().replace(/\?$/, ''); }) };
      }
    }

    // search the knowledge base
    var r = search(qn), best = r.res[0];
    if (!best || best.raw < 1.6 || (best.hit < 2 && best.raw < 2.4)) {
      return {
        text: T(lang, 'I couldn\u2019t find that in the OrbitX mission data. I can answer questions about Pioneer-1, Asteria-7 and Nova Catch-1 (and the OrbitX One, Heavy and Nova vehicles). Try one of these:',
          'Ye mujhe OrbitX mission data me nahi mila. Main Pioneer-1, Asteria-7 aur Nova Catch-1 (aur OrbitX One, Heavy, Nova vehicles) ke baare me jawab de sakta hoon. In me se koi try kijiye:'),
        chips: chipsFor(pageMission, lang)
      };
    }
    return fromResult(r, lang, q);
  }

  function fromResult(r, lang, q) {
    var best = r.res[0];
    var text = pick(best.c, r.qset, lang);
    if (lang === 'hi' && !best.c.th) text = 'Ye jawab mission data se hai (English me):\n\n' + text;
    var ans = { text: text, src: srcOf(best.c), chips: [] };

    if (!r.det.length && MISSIONS[best.c.m]) {
      var other = r.res.filter(function (x) { return x.c.m !== best.c.m && MISSIONS[x.c.m] && x.s >= best.s * 0.75; })[0];
      if (other) ans.also = srcOf(other.c);
    }
    var mm = MISSIONS[best.c.m] ? best.c.m : pageMission;
    ans.chips = chipsFor(mm, lang).filter(function (c) { return c.toLowerCase().replace(/\?$/, '') !== q.toLowerCase().replace(/\?$/, ''); });
    return ans;
  }

  /* ---------- optional real AI backend ---------- */
  var CONTEXT = KB.filter(function (c) { return MISSIONS[c.m]; }).map(function (c) { return '[' + c.n + ' - ' + c.h + '] ' + c.t; }).join('\n');
  function ask(q) {
    if (!API_URL) return Promise.resolve(local(q));
    return fetch(API_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, mission: pageMission, context: CONTEXT })
    }).then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
      .then(function (d) { if (!d || !d.answer) throw new Error('empty'); return { text: d.answer, chips: chipsFor(pageMission, detectLang(q)) }; })
      .catch(function () { return local(q); });
  }

  /* ---------- UI ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var fab = el('button', 'chat-fab');
  fab.type = 'button';
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'missionChat');
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.6-.8L3 20.5l1.5-4.7A8.4 8.4 0 1 1 21 11.5z"/></svg><span>Ask about missions</span>';

  var panel = el('div', 'chat-panel'); panel.id = 'missionChat';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Ask about missions');
  var head = el('div', 'chat-head');
  var ht = el('div'); ht.appendChild(el('div', 'chat-title', 'Ask about missions')); ht.appendChild(el('div', 'chat-sub', 'Pioneer-1 \u00b7 Asteria-7 \u00b7 Nova Catch-1'));
  var closeBtn = el('button', 'chat-close', '\u00d7'); closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Close chat');
  head.appendChild(ht); head.appendChild(closeBtn);
  var log = el('div', 'chat-log'); log.setAttribute('aria-live', 'polite');
  var form = el('form', 'chat-form');
  var input = el('input', 'chat-input'); input.type = 'text'; input.maxLength = 300; input.placeholder = 'Ask a question\u2026 / Sawal poochhiye\u2026'; input.setAttribute('aria-label', 'Your question'); input.autocomplete = 'off';
  var send = el('button', 'chat-send', 'Send'); send.type = 'submit';
  form.appendChild(input); form.appendChild(send);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(form);
  document.body.appendChild(fab); document.body.appendChild(panel);

  var chipsEl = null, started = false;

  function scrollDown() { log.scrollTop = log.scrollHeight; }
  function clearChips() { if (chipsEl && chipsEl.parentNode) chipsEl.parentNode.removeChild(chipsEl); chipsEl = null; }
  function addUser(t) { clearChips(); log.appendChild(el('div', 'msg user', t)); scrollDown(); }

  function addBot(a) {
    clearChips();
    var m = el('div', 'msg bot');
    String(a.text || '').split('\n\n').forEach(function (p) { if (p) m.appendChild(el('p', null, p)); });
    if (a.list) {
      var ul = el('ul', 'msg-list');
      a.list.forEach(function (it) {
        var li = el('li');
        if (it.u) { var l = el('a', null, it.t); l.href = it.u; li.appendChild(l); } else li.appendChild(el('strong', null, it.t));
        if (it.b) li.appendChild(el('span', null, ' \u2014 ' + it.b));
        if (it.s) li.appendChild(el('em', null, it.s));
        ul.appendChild(li);
      });
      m.appendChild(ul);
    }
    if (a.src) {
      var s = el('div', 'src');
      s.appendChild(document.createTextNode('Source: ' + a.src.label));
      if (a.src.url) { var lk = el('a', null, ' \u2192 open page'); lk.href = a.src.url; s.appendChild(lk); }
      m.appendChild(s);
    }
    if (a.also) {
      var al = el('div', 'src');
      al.appendChild(document.createTextNode('Also see: ' + a.also.label));
      if (a.also.url) { var lk2 = el('a', null, ' \u2192 open page'); lk2.href = a.also.url; al.appendChild(lk2); }
      m.appendChild(al);
    }
    log.appendChild(m);
    if (a.chips && a.chips.length) {
      chipsEl = el('div', 'chips');
      a.chips.forEach(function (c) {
        var b = el('button', 'chip', c); b.type = 'button';
        b.addEventListener('click', function () { handle(c); });
        chipsEl.appendChild(b);
      });
      log.appendChild(chipsEl);
    }
    scrollDown();
  }

  function handle(q) {
    q = String(q || '').trim();
    if (!q) return;
    addUser(q);
    var t = el('div', 'msg bot typing'); t.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(t); scrollDown();
    var t0 = Date.now();
    ask(q).then(function (a) {
      var wait = Math.max(0, 450 - (Date.now() - t0));
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); addBot(a); }, wait);
    });
  }

  function setOpen(open) {
    panel.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open);
    fab.classList.toggle('hidden', open && window.innerWidth <= 600);
    if (window.innerWidth <= 600) document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      if (!started) {
        started = true;
        addBot({
          text: 'Hi! I\u2019m the OrbitX mission assistant. Ask me anything about these launches \u2014 how they flew, what they carried, how the boosters landed.\n\nAap Hindi ya Hinglish me bhi pooch sakte hain. Jawab OrbitX mission data se aate hain.',
          chips: chipsFor(pageMission, 'en')
        });
      }
      setTimeout(function () { input.focus(); }, 120);
    }
  }

  fab.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
  closeBtn.addEventListener('click', function () { setOpen(false); fab.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; handle(v); });
})();