import { useEffect, useState } from "react";

const RACE_DATE = new Date(2026, 11, 6);
const PLAN_START = new Date(2026, 3, 20);

function getDaysToRace() {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.round((RACE_DATE - todayStart) / 86400000));
}

function getCurrentWeek() {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((todayStart - PLAN_START) / (7 * 86400000));
  return Math.min(Math.max(1, diff + 1), 33);
}

const PHASES = [
  {
    id: 1, name: "Foundation", wRange: [1, 8], dates: "Apr 20 - Jun 14",
    accent: "#22d3ee", accentBg: "rgba(34,211,238,0.08)",
    focus: "Aerobic base, ankle protection, build the daily habit",
    milestone: "Swim 800M continuous · Long run 5 mi · Trainer 80 min",
    note: "Be patient - the ankle demands respect in these first 8 weeks. Run easy and stop if anything feels off. Swim and bike can push harder. Order your road bike by Week 6 so it arrives before open water begins.",
  },
  {
    id: 2, name: "Build I", wRange: [9, 16], dates: "Jun 15 - Aug 9",
    accent: "#86efac", accentBg: "rgba(134,239,172,0.08)",
    focus: "Volume increase, open water debut, first brick workouts",
    milestone: "Swim 1,500M continuous · Long run 8 mi · 2+ hour long ride",
    note: "Open water at Lake Pleasant will feel completely different - no black line, no walls. Embrace it. Brick workouts begin (bike immediately into run). Your legs will feel like concrete. That adaptation is the whole point.",
  },
  {
    id: 3, name: "Build II", wRange: [17, 24], dates: "Aug 10 - Oct 4",
    accent: "#fb923c", accentBg: "rgba(251,146,60,0.08)",
    focus: "Race-distance swim achieved, peak bricks, maximum volume",
    milestone: "Swim 1,900M race distance · Long run 12 mi · 3.75h brick",
    note: "Week 19 you swim 1,900M for the first time - your confidence changes forever. August in Phoenix is brutal: hydrate before, during, and after every session. These long bricks are your most race-specific work.",
  },
  {
    id: 4, name: "Race Prep", wRange: [25, 30], dates: "Oct 5 - Nov 15",
    accent: "#d946ef", accentBg: "rgba(217,70,239,0.08)",
    focus: "Race-pace sharpening, full simulations, confidence building",
    milestone: "Full race simulation · Race-pace 1,900M swim · 10-mi tempo run",
    note: "Weeks 25 & 28 are full race simulations: Swim -> Bike -> Run back-to-back. THIS is where you dial in your nutrition strategy. Race day is not the place to experiment with gels or pacing.",
  },
  {
    id: 5, name: "Taper", wRange: [31, 33], dates: "Nov 16 - Dec 6",
    accent: "#fbbf24", accentBg: "rgba(251,191,36,0.08)",
    focus: "Volume reduction, stay sharp, arrive fresh and confident",
    milestone: "Race Day: December 6, 2026 - La Quinta, CA",
    note: "You'll feel sluggish and anxious - 'taper madness' is completely normal. Do not add extra sessions. Your fitness is banked from 30 weeks of work. Sleep, hydrate, and visualize the race.",
  },
];

const DISC = {
  rest: { color: "#475569", bg: "rgba(71,85,105,0.08)", label: "Rest" },
  swim: { color: "#06b6d4", bg: "rgba(6,182,212,0.1)", label: "Swim" },
  bike: { color: "#eab308", bg: "rgba(234,179,8,0.1)", label: "Bike" },
  run: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Run" },
  str: { color: "#a855f7", bg: "rgba(168,85,247,0.1)", label: "Strength" },
  brick: { color: "#f97316", bg: "rgba(249,115,22,0.1)", label: "Brick" },
  ow: { color: "#38bdf8", bg: "rgba(56,189,248,0.1)", label: "Open Water" },
  race: { color: "#ef4444", bg: "rgba(239,68,68,0.15)", label: "Race Day" },
};

const d = (type, time, title, detail, flag = "") => ({ type, time, title, detail, flag });
const R = d("rest", "", "Rest", "Full recovery. Hydrate, stretch, sleep well.");
const DAY_LABELS = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];

function getWeekDisplayStartDate(weekNumber) {
  const weekStart = new Date(PLAN_START.getFullYear(), PLAN_START.getMonth(), PLAN_START.getDate());
  weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
  return weekStart;
}

function getDayLabelWithDate(weekNumber, dayIndex) {
  const weekStart = getWeekDisplayStartDate(weekNumber);
  const dayDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
  dayDate.setDate(dayDate.getDate() + dayIndex);
  return `${DAY_LABELS[dayIndex]} - ${dayDate.getMonth() + 1}/${dayDate.getDate()}`;
}

function formatWeekDateRange(weekNumber) {
  const weekStart = getWeekDisplayStartDate(weekNumber);
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
  weekEnd.setDate(weekEnd.getDate() + 6);
  const startMonth = weekStart.toLocaleString("en-US", { month: "short" });
  const endMonth = weekEnd.toLocaleString("en-US", { month: "short" });
  if (startMonth === endMonth) return `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}`;
  return `${startMonth} ${weekStart.getDate()}-${endMonth} ${weekEnd.getDate()}`;
}

const WEEKS = [
  {
    wk: 1, ph: 1, dates: "Apr 16-22", theme: "First Steps",
    callout: "Ankle alert: All runs are strictly easy pace. Walk breaks encouraged. Stop if you feel anything in the ankle.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 600M", "Warm Up 100M · 4×100M easy freestyle · 2×50M kick drill · Cool Down 100M. Focus on breathing every 3 strokes."),
      d("bike", "AM 6:00", "Trainer 45 min", "Zone 2 only (conversational pace). Cadence 85-95 rpm. Flat resistance. Build the habit."),
      R,
      d("run", "PM 6:00", "Run 2.5 mi + Strength", "Easy run, walk breaks OK · 3×10 squats, lunges, push-ups, glute bridges, 30s plank ×2.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 50 min", "Z2 steady. Same effort as Wednesday. Consistency is everything in Phase 1."),
      d("run", "AM 7:00", "Long Run 3 mi", "Very easy. Conversational pace. Note how ankle feels at each mile."),
    ],
  },
  {
    wk: 2, ph: 1, dates: "Apr 23-29", theme: "Settling In",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 700M", "Warm Up 100M · 5×100M with 20s rest · Catch-up drill 100M · Cool Down 100M."),
      d("bike", "AM 6:00", "Trainer 50 min", "Z2. Track RPE (aim 5-6/10). Should feel fully sustainable."),
      R,
      d("run", "PM 6:00", "Run 3 mi + Strength", "Easy run · 3×12 squats, 3×10 lunges ea, push-ups, 2×45s plank, 3×15 glute bridges.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 55 min", "Z2. 5 min longer than Wednesday."),
      d("run", "AM 7:00", "Long Run 3.5 mi", "Easy 10:00-11:00/mi. No ego today."),
    ],
  },
  {
    wk: 3, ph: 1, dates: "Apr 30-May 6", theme: "Finding Rhythm",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 800M", "Warm Up 100M · 4×150M with 30s rest · Fingertip-drag drill 100M · Cool Down 100M."),
      d("bike", "AM 6:00", "Trainer 55 min", "Z2 + 2-min Z3 surge at the 45-min mark. Easy cool-down to finish."),
      R,
      d("run", "PM 6:00", "Run 3.5 mi + Strength", "Easy run · Single-leg work: Bulgarian splits 3×8, step-ups 3×10, calf raises 3×20.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 60 min", "Z2. First 60-min ride. Note how legs feel at the end.", "First milestone"),
      d("run", "AM 7:00", "Long Run 4 mi", "Easy. You've run this recently - should feel familiar."),
    ],
  },
  {
    wk: 4, ph: 1, dates: "May 7-13", theme: "First Milestone Week",
    callout: "Swim goal this week: 800M continuous. Go slow, breathe, don't stop. This is your first big breakthrough.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 900M", "Warm Up 100M · 800M CONTINUOUS (pace yourself!) · Cool Down if energy remains.", "Goal: 800M nonstop"),
      d("bike", "AM 6:00", "Trainer 60 min", "Z2 with 2×5 min Z3 intervals. Recover fully at Z2 between each."),
      R,
      d("run", "PM 6:00", "Run 4 mi + Strength", "Easy pace · 3×12 goblet squats, RDL, push-ups, hip thrusts, plank. 40 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 65 min", "Z2-Z3 mix. Building to comfortable 65 min."),
      d("run", "AM 7:00", "Long Run 4.5 mi", "Easy-moderate. First time past 4 miles in months - stay conservative."),
    ],
  },
  {
    wk: 5, ph: 1, dates: "May 14-20", theme: "Steady Progress",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,000M", "Warm Up 100M · 2×400M (60s rest) or 800M continuous if Week 4 felt good · Drills 100M."),
      d("bike", "AM 6:00", "Trainer 65 min", "Z2. Fully conversational throughout. Engine building."),
      R,
      d("run", "PM 6:00", "Run 4 mi + Strength", "Easy · Core & hip focus: planks, side planks, dead bugs, clamshells. Ankle stability work.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 70 min", "Z2. Building toward the 80-min milestone."),
      d("run", "AM 7:00", "Long Run 5 mi", "First 5-miler! Easy pace. Walk 60s at mile 2.5 if needed.", "Milestone"),
    ],
  },
  {
    wk: 6, ph: 1, dates: "May 21-27", theme: "Consistency Compounds",
    callout: "Order your road bike this week if you haven't. Target arrival: mid-June for Phase 2 open water bricks.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,100M", "Warm Up 100M · 800M continuous (push it!) · Drills 200M · Cool Down 100M."),
      d("bike", "AM 6:00", "Trainer 70 min", "Z2 with 3×5 min Z3 efforts. Build your aerobic engine."),
      R,
      d("run", "PM 6:00", "Run 4.5 mi + Strength", "Easy run · Increase weights where bodyweight feels easy. Squats, lunges, RDLs. 40 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 75 min", "Z2 sustained. Comfortable at 75 min is the goal."),
      d("run", "AM 7:00", "Long Run 5 mi", "Same distance as last week but should feel easier. That's fitness."),
    ],
  },
  {
    wk: 7, ph: 1, dates: "May 28-Jun 3", theme: "Phase 1 Peak",
    callout: "Swim goal: 1,000M without stopping. Go slow - distance matters, not pace. This is a major milestone.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,200M", "Warm Up 100M · 1,000M CONTINUOUS attempt · Rest · Cool Down 100M. Biggest swim yet.", "Goal: 1,000M nonstop"),
      d("bike", "AM 6:00", "Trainer 75 min", "Z2 with simulated hills (raise resistance for 5 min × 3). Climbing prep."),
      R,
      d("run", "PM 6:00", "Run 5 mi + Strength", "Easy run · Heavier compound work: squats, lunges, push-ups, bent rows, RDLs. 45 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 80 min", "Z2 sustained. Phase 1 longest ride - milestone.", "Milestone"),
      d("run", "AM 7:00", "Long Run 5.5 mi", "Easy-moderate. Phase 1 longest run. Keep it slow."),
    ],
  },
  {
    wk: 8, ph: 1, dates: "Jun 4-10", theme: "Recovery Week",
    callout: "Volume drops ~30%. This is intentional - your body adapts during rest, not training. Do not skip this week.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 900M (Easy)", "Warm Up 100M · 600M easy continuous · Drills 200M. Technique focus, zero effort."),
      d("bike", "AM 6:00", "Trainer 60 min", "Z2 easy. No intervals. Just spin and let legs recover."),
      R,
      d("run", "PM 6:00", "Run 3.5 mi + Light Strength", "Very easy · Bodyweight only. Mobility and foam rolling. 30 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Trainer 60 min", "Easy Z2. Legs should feel noticeably fresher by week's end."),
      d("run", "AM 7:00", "Long Run 4 mi", "Easy and relaxed. Reflect on how far you've come in 8 weeks."),
    ],
  },
  {
    wk: 9, ph: 2, dates: "Jun 11-17", theme: "Open Water Debut",
    callout: "First open water swim at Lake Pleasant this Saturday! Bring a buddy, wear a bright cap. No lane lines, no walls - that's exactly the point.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,200M (Pool)", "Warm Up 100M · 1,000M continuous (Week 7 milestone confirmed) · Drills 200M."),
      d("bike", "AM 6:00", "Road Bike / Trainer 80 min", "If road bike arrived: first outdoor ride! Easy Z2. If not: trainer 80 min."),
      R,
      d("run", "PM 6:00", "Run 5 mi + Strength", "Easy run · Leg focus: squats, lunges, step-ups, calf raises. 45 min.", "PM - sleep in"),
      d("ow", "AM 7:00", "Open Water 800M + Brick 30 min", "Lake Pleasant: Easy 800M (sight every 10 strokes) · Immediately ride 30 min. First brick!", "OW + first brick"),
      d("run", "AM 7:00", "Long Run 6 mi", "Easy pace. First 6-miler! Walk at miles 2 & 4 if needed.", "Milestone"),
    ],
  },
  {
    wk: 10, ph: 2, dates: "Jun 18-24", theme: "Momentum Builds",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,300M", "Warm Up 100M · 3×400M with 45s rest · Drills 100M · Cool Down 100M."),
      d("bike", "AM 6:00", "Road / Trainer 85 min", "Z2. Outdoor: flat, low-traffic roads. Dial in bike fit."),
      R,
      d("run", "PM 6:00", "Run 5.5 mi + Strength", "Easy-moderate · Upper + core: push-ups, rows, planks, dead bugs. 45 min.", "PM - sleep in"),
      d("ow", "AM 7:00", "Open Water 1,000M + Brick 45 min", "Lake Pleasant: 1,000M OW (work on sighting landmarks) · Bike 45 min brick.", "Open water"),
      d("run", "AM 7:00", "Long Run 6.5 mi", "Easy. Building toward a half marathon. Patience pays."),
    ],
  },
  {
    wk: 11, ph: 2, dates: "Jun 25-Jul 1", theme: "90-Min Ride Milestone",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,400M", "Warm Up 100M · 1,200M continuous attempt · Cool Down 200M."),
      d("bike", "AM 6:00", "Road Ride 90 min", "90-minute milestone ride. Z2 throughout. Bring water. Outdoor preferred.", "Milestone"),
      R,
      d("run", "PM 6:00", "Run 6 mi + Strength", "Easy-moderate · Increase weight if prior sessions felt easy. 45 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 105 min", "First time over 100 min! Bring nutrition (gel or banana at 50 min).", "Milestone"),
      d("run", "AM 7:00", "Long Run 7 mi", "Easy. 7 miles - celebrate quietly and keep it slow.", "Milestone"),
    ],
  },
  {
    wk: 12, ph: 2, dates: "Jul 2-8", theme: "Race-Distance Swim",
    callout: "Tuesday: attempt 1,500M continuous - the full 70.3 swim distance. Go slow. Don't stop. This changes everything.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,500M", "Warm Up 100M · 1,500M CONTINUOUS (full 70.3 race distance!) · Cool Down if possible.", "Full race distance"),
      d("bike", "AM 6:00", "Road Ride 90 min", "Z2-Z3. 60 min Z2 + 2×10 min Z3 tempo efforts."),
      R,
      d("run", "PM 6:00", "Run 6 mi + Strength", "Moderate · Strength: peak Phase 2 intensity. 45 min heavy compound.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 2 Hours", "2-hour milestone! Nutrition: gel at 60 min. Bring 2 bottles.", "Milestone: 2 hours"),
      d("run", "AM 7:00", "Long Run 7 mi", "Easy. Coming off 2-hour ride day - keep this truly comfortable."),
    ],
  },
  {
    wk: 13, ph: 2, dates: "Jul 9-15", theme: "Recovery Week",
    callout: "Planned cutback - volume drops ~30%. You earned it.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,100M (Easy)", "Easy continuous 900M + drills 200M. No pressure on pace."),
      d("bike", "AM 6:00", "Road / Trainer 70 min", "Z2 easy. No intervals this week."),
      R,
      d("run", "PM 6:00", "Run 5 mi + Light Strength", "Easy · Bodyweight only + foam rolling + mobility. 30 min.", "PM - sleep in"),
      d("ow", "AM 7:00", "Open Water 800M + Bike 30 min", "Easy OW at Butcher Jones or Lake Pleasant · Short easy brick.", "Open water"),
      d("run", "AM 7:00", "Long Run 5.5 mi", "Very easy. Legs should feel rested."),
    ],
  },
  {
    wk: 14, ph: 2, dates: "Jul 16-22", theme: "Back to Work",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,600M", "Warm Up 100M · 1,400M continuous (or 2×700M w/ 60s rest) · Drills 100M."),
      d("bike", "AM 6:00", "Road Ride 95 min", "Z2-Z3. Include 2×10 min Z3 tempo segments."),
      R,
      d("run", "PM 6:00", "Run 7 mi + Strength", "Moderate pace · 45 min all major lifts heavier. 3×10-12.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 2h 15min", "Longest ride yet. Bring 2+ bottles and fuel every 45-60 min."),
      d("run", "AM 7:00", "Long Run 8 mi", "Easy. 8 miles - you're starting to feel like a triathlete.", "Milestone"),
    ],
  },
  {
    wk: 15, ph: 2, dates: "Jul 23-29", theme: "First Real Brick",
    callout: "Saturday brick (Bike 2h -> Run 3 mi) is your most important workout yet. Run SLOW after the bike - brick effect is real.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,700M", "Warm Up 100M · 1,500M continuous (Week 12 confirmation) · Cool Down 100M."),
      d("bike", "AM 6:00", "Road Ride 100 min", "Z2-Z3. 3×8 min Z3 efforts."),
      R,
      d("run", "PM 6:00", "Run 7.5 mi + Strength", "Easy-moderate · Glutes and legs priority for brick prep. 45 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 2h -> Run 3 mi", "2-hour Z2-Z3 ride -> rack bike -> run 3 miles easy. Practice T2 transition. Legs will feel heavy.", "Key workout"),
      d("run", "AM 7:00", "Long Run 8 mi", "Easy recovery run. Fatigue from Saturday is real - honor it."),
    ],
  },
  {
    wk: 16, ph: 2, dates: "Jul 30-Aug 5", theme: "Build I Recovery",
    callout: "Recovery before Phase 3. The hardest block of training starts next week. Rest well.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,200M (Easy)", "Easy continuous 1,000M + drills 200M. Technique focus."),
      d("bike", "AM 6:00", "Road / Trainer 75 min", "Z2 easy. No hard efforts."),
      R,
      d("run", "PM 6:00", "Run 5 mi + Light Strength", "Easy · Bodyweight + mobility. 30 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 90 min", "Easy Z2. Comfortable and controlled."),
      d("run", "AM 7:00", "Long Run 6 mi", "Easy. Phase 3 starts next week - you're ready."),
    ],
  },
  {
    wk: 17, ph: 3, dates: "Aug 6-12", theme: "Phase 3 Launch",
    callout: "Highest-volume phase begins. August in Phoenix is extreme - hydrate 16-24 oz before every morning session. No exceptions.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,800M", "Warm Up 100M · 3×500M with 45s rest · Drills 100M · Cool Down 100M."),
      d("bike", "AM 6:00", "Road Ride 110 min", "Z2-Z3. Include 3×10 min Z3 tempo efforts."),
      R,
      d("run", "PM 6:00", "Run 8 mi + Strength", "Moderate pace · 45 min compound focus on hip stability and posterior chain.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 2.5h -> Run 4 mi", "2.5-hour ride Z2 -> run 4 miles easy. Practice race nutrition every 45 min on bike.", "Key workout"),
      d("run", "AM 7:00", "Long Run 9 mi", "Easy. 9 miles - bring water and gel."),
    ],
  },
  {
    wk: 18, ph: 3, dates: "Aug 13-19", theme: "Open Water + Big Ride",
    days: [
      R,
      d("ow", "AM 6:00", "Open Water 1,600M", "Butcher Jones or Lake Pleasant. 1,600M continuous - stronger OW effort this week.", "Open water"),
      d("bike", "AM 6:00", "Road Ride 115 min", "Z2-Z3 outdoor. Rolling terrain if available."),
      R,
      d("run", "PM 6:00", "Run 8 mi + Strength", "Moderate · 45 min, increase weights across all lifts.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 2h 45min", "165 min. Bring 2-3 bottles + fuel every 45 min. Practice race-day nutrition strategy."),
      d("run", "AM 7:00", "Long Run 9.5 mi", "Easy-moderate. Almost at 10 miles."),
    ],
  },
  {
    wk: 19, ph: 3, dates: "Aug 20-26", theme: "Race-Distance Swim",
    callout: "Tuesday: Swim 1,900M continuous - the full 70.3 race distance. This single workout changes your confidence forever. Go slow. Don't stop.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,900M", "Warm Up 100M · 1,900M CONTINUOUS (full race distance!) · Cool Down optional.", "Full race distance"),
      d("bike", "AM 6:00", "Road Ride 120 min", "Z2-Z3. 2-hour ride. Building serious bike base."),
      R,
      d("run", "PM 6:00", "Run 9 mi + Strength", "Easy-moderate · 45 min, legs priority.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 3h -> Run 4.5 mi", "3-hour ride -> 4.5-mile run. Longest brick to date. Fuel every 45 min on bike.", "Key workout"),
      d("run", "AM 7:00", "Long Run 10 mi", "Easy. Double-digit - you are a triathlete.", "Milestone"),
    ],
  },
  {
    wk: 20, ph: 3, dates: "Aug 27-Sep 2", theme: "Recovery Week",
    callout: "You earned this. Body is adapting from the biggest weeks of the plan.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,400M (Easy)", "Warm Up 100M · 1,000M easy continuous · Drills 300M. Relax into the water."),
      d("bike", "AM 6:00", "Road Ride 90 min", "Z2 easy. No intensity."),
      R,
      d("run", "PM 6:00", "Run 6 mi + Light Strength", "Easy · Bodyweight + mobility. 30 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 2h", "Easy Z2. Comfortable. Bring nutrition."),
      d("run", "AM 7:00", "Long Run 7 mi", "Very easy. Let the adaptation happen."),
    ],
  },
  {
    wk: 21, ph: 3, dates: "Sep 3-9", theme: "Peak Volume Week",
    callout: "Biggest week of the plan. Saturday brick is 3.5h bike -> 5-mile run. This simulates the back half of your race. Fueling is not optional.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 2,000M", "Warm Up 100M · 1,900M continuous (or 2×900M w/ 60s rest) · Cool Down 100M. Above race distance!", "Above race distance"),
      d("bike", "AM 6:00", "Road Ride 130 min", "Z2-Z3 strong. Include 20-min race-pace segment."),
      R,
      d("run", "PM 6:00", "Run 9 mi + Strength", "Easy-moderate · Peak strength intensity of the plan. 45 min all compound.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 3.5h -> Run 5 mi", "Longest brick of the plan. 3.5-hour ride -> 5 miles. This builds enormous race confidence.", "Peak workout"),
      d("run", "AM 7:00", "Long Run 11 mi", "Easy. 11 miles - your longest run yet.", "Milestone"),
    ],
  },
  {
    wk: 22, ph: 3, dates: "Sep 10-16", theme: "Sustained Peak",
    days: [
      R,
      d("ow", "AM 6:00", "Open Water 1,800M", "Butcher Jones or Lake Pleasant. 1,800M - simulate race conditions.", "Open water"),
      d("bike", "AM 6:00", "Road Ride 135 min", "Z2-Z3. Sustained 2h 15min outdoor."),
      R,
      d("run", "PM 6:00", "Run 10 mi + Strength", "Moderate - longest midweek run of the plan! · Strength 45 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 3.5h", "Longest standalone ride. Fuel every 45 min. Aim to negative split."),
      d("run", "AM 7:00", "Long Run 11 mi", "Easy. Second consecutive 11-miler cements fitness."),
    ],
  },
  {
    wk: 23, ph: 3, dates: "Sep 17-23", theme: "Summit Week",
    callout: "This is the peak of your entire training plan. After this week it's recovery and race prep. You've earned this summit.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 2,100M", "Warm Up 100M · 2,000M continuous · Cool Down 100M. Above race distance. Confidence locked in.", "Milestone"),
      d("bike", "AM 6:00", "Road Ride 140 min", "Z2-Z3. 2h 20min sustained strong effort."),
      R,
      d("run", "PM 6:00", "Run 11 mi + Strength", "Easy-moderate. Longest midweek run of the plan · Strength 45 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 3.75h -> Run 5 mi", "Peak brick. 3h 45min ride -> 5-mile run. Your supreme confidence workout.", "Peak workout"),
      d("run", "AM 7:00", "Long Run 12 mi", "Easy. 12 miles - your longest run ever. Race day is ready.", "Milestone: longest run"),
    ],
  },
  {
    wk: 24, ph: 3, dates: "Sep 24-30", theme: "Phase 3 Recovery",
    callout: "Critical recovery. You've peaked. Now it's time to sharpen.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,500M (Easy)", "Easy 1,300M continuous + drills 200M. Feel the water, not the clock."),
      d("bike", "AM 6:00", "Road Ride 90 min", "Z2 easy. No intensity. Legs need recovery."),
      R,
      d("run", "PM 6:00", "Run 7 mi + Light Strength", "Easy · Bodyweight + mobility. 30 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 2h", "Comfortable Z2. Enjoy the fitness you've built."),
      d("run", "AM 7:00", "Long Run 8 mi", "Easy. Phase 4 starts next week."),
    ],
  },
  {
    wk: 25, ph: 4, dates: "Oct 1-7", theme: "Race Simulation #1",
    callout: "Saturday: full race simulation! OW Swim -> Bike -> Run. Wear your race kit, use race nutrition, practice transitions. Take notes on what to improve.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,900M (Race Pace)", "Warm Up 100M · 1,900M at race effort (comfortably hard, not max) · Cool Down 100M."),
      d("bike", "AM 6:00", "Road Ride 130 min", "Z2-Z3. 3×10 min race-pace segments."),
      R,
      d("run", "PM 6:00", "Run 9 mi + Strength", "Easy-moderate with 2×1 mi at race pace (~9:15/mi) · Strength 40 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Race Sim: Swim 1,900M -> Bike 3h -> Run 3 mi", "Full triathlon simulation! OW -> bike -> run. Wear race kit. Practice T1 & T2.", "Race simulation"),
      d("run", "AM 7:00", "Long Run 10 mi", "Easy. Reflect on the race simulation - what to adjust."),
    ],
  },
  {
    wk: 26, ph: 4, dates: "Oct 8-14", theme: "Race Specificity",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,900M (Strong)", "Warm Up 100M · 1,900M at strong-but-controlled race effort."),
      d("bike", "AM 6:00", "Road Ride 120 min", "Race-pace focus: 45 min Z2 warmup -> 30 min race pace -> 45 min Z2 cool-down."),
      R,
      d("run", "PM 6:00", "Run 9 mi + Strength", "3 miles at race pace within easy run · Strength 40 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 3.5h -> Run 5 mi", "Strong brick. Push bike race pace for final 45 min. Run at race pace miles 2-4.", "Key workout"),
      d("run", "AM 7:00", "Long Run 10 mi", "Easy. Consistent double-digit long runs = race-day confidence."),
    ],
  },
  {
    wk: 27, ph: 4, dates: "Oct 15-21", theme: "Mid-Phase Recovery",
    callout: "Reload before the final peak weeks of Phase 4.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,500M", "Warm Up 100M · 1,300M easy · Drills 100M. Relaxed swim."),
      d("bike", "AM 6:00", "Road Ride 90 min", "Z2 easy. No race-pace work this week."),
      R,
      d("run", "PM 6:00", "Run 7 mi + Light Strength", "Easy · Bodyweight + mobility. 30 min.", "PM - sleep in"),
      d("bike", "AM 7:00", "Road Ride 2h", "Easy Z2 long ride."),
      d("run", "AM 7:00", "Long Run 8 mi", "Easy. Legs should feel fresh for Week 28."),
    ],
  },
  {
    wk: 28, ph: 4, dates: "Oct 22-28", theme: "Race Simulation #2",
    callout: "Saturday: second full race simulation. Execute more precisely than Week 25. Dial in nutrition timing.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 2,000M", "Warm Up 100M · 2,000M at controlled race effort. Strong, confident swim.", "Milestone"),
      d("bike", "AM 6:00", "Road Ride 130 min", "Z2-Z3 with 20 min sustained race-pace effort."),
      R,
      d("run", "PM 6:00", "Run 10 mi + Strength", "Easy-moderate with 2×1.5 mi at race pace · Strength 40 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Race Sim #2: Swim 1,900M -> Bike 3.5h -> Run 5 mi", "Full simulation. Push the run harder than Week 25. Fine-tune nutrition.", "Race simulation"),
      d("run", "AM 7:00", "Long Run 10 mi", "Easy. You are race-ready. This confirms it."),
    ],
  },
  {
    wk: 29, ph: 4, dates: "Oct 29-Nov 4", theme: "Final Big Push",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,900M", "Race-pace effort. Strong and confident."),
      d("bike", "AM 6:00", "Road Ride 120 min", "Z2-Z3. 2×15 min race-pace efforts."),
      R,
      d("run", "PM 6:00", "Run 10 mi + Strength", "Easy-moderate · Strength 40 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 3h -> Run 4 mi", "Slightly reduced vs. Week 28. Strong but not max effort.", "Key workout"),
      d("run", "AM 7:00", "Long Run 9 mi", "Easy. Volume beginning its descent."),
    ],
  },
  {
    wk: 30, ph: 4, dates: "Nov 5-11", theme: "Volume Begins Dropping",
    callout: "First volume reduction. Intensity stays high. Feel sharp and athletic, not exhausted.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,800M", "Strong 1,600M at race effort + drills 200M."),
      d("bike", "AM 6:00", "Road Ride 110 min", "Z2-Z3. Quality race-pace efforts included."),
      R,
      d("run", "PM 6:00", "Run 8 mi + Light Strength", "Easy-moderate · Strength drops to 30 min.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 2.5h -> Run 3 mi", "Controlled and sharp. Feel athletic - not surviving.", "Key workout"),
      d("run", "AM 7:00", "Long Run 8 mi", "Easy. Race is 25 days away. Stay calm and confident."),
    ],
  },
  {
    wk: 31, ph: 5, dates: "Nov 12-18", theme: "Taper Begins (-30%)",
    callout: "Taper madness is real. You may feel sluggish or like your fitness is disappearing. It's not - your body is storing energy. Trust the process.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,400M", "Warm Up 100M · 1,100M easy with a few 50M race-pace bursts · Cool Down 200M."),
      d("bike", "AM 6:00", "Road Ride 80 min", "Fresh legs. Z2 with one 10-min race-pace effort in the middle."),
      R,
      d("run", "PM 6:00", "Run 6 mi + Light Strength", "Easy · 20 min bodyweight only. No heavy lifting.", "PM - sleep in"),
      d("brick", "AM 7:00", "Brick: Bike 90 min -> Run 2.5 mi", "Short and sharp. Feel athletic and confident - sharpening, not suffering."),
      d("run", "AM 7:00", "Long Run 7 mi", "Easy. Second-to-last long run of the training cycle."),
    ],
  },
  {
    wk: 32, ph: 5, dates: "Nov 19-25", theme: "Deep Taper (-50%)",
    callout: "Volume cuts in half. Do NOT add extra sessions. You cannot gain fitness in 2 weeks - only lose it by overdoing. Trust 30 weeks of work.",
    days: [
      R,
      d("swim", "AM 6:00", "Swim 1,200M (Easy)", "Easy 1,000M + drills 200M. Light and confidence-building."),
      d("bike", "AM 6:00", "Road Ride 60 min", "Easy Z2. Spin the legs. Nothing more."),
      R,
      d("run", "PM 6:00", "Run 4 mi (Easy)", "Very easy. No strength training this week at all.", "PM - sleep in"),
      d("bike", "AM 7:00", "Easy Ride 60 min", "Z1-Z2. Short and gentle. Protect the legs."),
      d("run", "AM 7:00", "Long Run 5 mi", "Easy. Last long run before race week. Enjoy it."),
    ],
  },
  {
    wk: 33, ph: 5, dates: "Nov 26-Dec 6", theme: "Race Week",
    callout: "Every decision this week is about arriving to the start line healthy, rested, and confident. No heroics - no extra training.",
    days: [
      d("rest", "", "Mon - Rest", "Full rest. Load complex carbs into meals. Hydrate extra. Early bed."),
      d("swim", "AM 6:00", "Tue - Swim 800M", "Easy pool swim. Short and relaxed. Just feel the water and your stroke."),
      d("bike", "AM 6:00", "Wed - Bike 40 min + Jog", "Easy 40-min spin -> 10-min very easy T-pace jog. Done by 8 AM."),
      d("run", "AM 7:00", "Thu - Run 20 min", "Very easy 20-min shakeout. Legs should feel springy."),
      d("rest", "", "Fri - Travel to La Quinta", "Drive to La Quinta, CA. Check in, rest, eat well. No workout."),
      d("bike", "AM 8:00", "Sat - Course Preview", "20-min easy spin -> 400M practice swim in race water · Rack bike in T1."),
      d("race", "AM 7:00", "Sun Dec 6 - Race Day", "Swim 1.2 mi -> Bike 56 mi -> Run 13.1 mi. You've done the work. Trust your training. Finish strong.", "Race day"),
    ],
  },
];

function DayCard({ day, label, onOpen }) {
  const disc = DISC[day.type] || DISC.rest;
  const isRest = day.type === "rest";
  const detailItems = day.detail
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{
        borderRadius: 8,
        border: `1px solid ${isRest ? "#1e293b" : `${disc.color}30`}`,
        borderTop: `3px solid ${isRest ? "#1e293b" : disc.color}`,
        background: day.type === "race" ? disc.bg : isRest ? "rgba(15,23,42,0.6)" : disc.bg,
        padding: "8px 7px",
        minWidth: 0,
        opacity: isRest ? 0.55 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      <div
        style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: disc.color,
          background: `${disc.color}18`,
          padding: "1px 5px",
          borderRadius: 3,
          width: "fit-content",
        }}
      >
        {disc.label}
      </div>
      {day.time && <div style={{ fontSize: 11, color: "#64748b" }}>{day.time}</div>}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.35, marginTop: 2 }}>{day.title}</div>
      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.45, marginTop: 1 }}>
        {detailItems.length > 1 ? (
          <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
            {detailItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 2 }}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          day.detail
        )}
      </div>
      {day.flag && (
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            fontWeight: 700,
            color: disc.color,
            background: `${disc.color}18`,
            padding: "2px 5px",
            borderRadius: 3,
            display: "inline-block",
          }}
        >
          {day.flag}
        </div>
      )}
    </div>
  );
}

export default function TrainingPlan() {
  const curWk = getCurrentWeek();
  const initPhase = (WEEKS.find((w) => w.wk === curWk) || WEEKS[0]).ph;
  const [activePh, setActivePh] = useState(initPhase);
  const [activeWk, setActiveWk] = useState(curWk);
  const [modalDay, setModalDay] = useState(null);
  const [modalDayLabel, setModalDayLabel] = useState("");

  const phase = PHASES.find((p) => p.id === activePh);
  const week = WEEKS.find((w) => w.wk === activeWk);
  const phaseWeeks = WEEKS.filter((w) => w.ph === activePh);
  const daysLeft = getDaysToRace();
  const weekDays =
    week && week.wk !== 33
      ? [week.days[0], week.days[1], week.days[2], week.days[4], week.days[3], week.days[5], week.days[6]]
      : week?.days || [];

  const switchPhase = (pid) => {
    setActivePh(pid);
    const first = WEEKS.find((w) => w.ph === pid);
    if (first) setActiveWk(first.wk);
  };

  const go = (delta) => {
    const nw = activeWk + delta;
    if (nw < 1 || nw > 33) return;
    const wd = WEEKS.find((w) => w.wk === nw);
    setActiveWk(nw);
    if (wd && wd.ph !== activePh) setActivePh(wd.ph);
  };
  const modalDisc = modalDay ? DISC[modalDay.type] || DISC.rest : DISC.rest;

  const openDayModal = (day, label) => {
    setModalDay(day);
    setModalDayLabel(label);
  };

  const closeDayModal = () => {
    setModalDay(null);
    setModalDayLabel("");
  };
  const modalDetailItems = modalDay
    ? modalDay.detail
        .split("·")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (!modalDay) return undefined;
    const onEscape = (e) => {
      if (e.key === "Escape") closeDayModal();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [modalDay]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 20% -20%, rgba(34,211,238,0.22), transparent 60%), radial-gradient(900px 450px at 80% 10%, rgba(168,85,247,0.18), transparent 55%), #050a13",
        color: "#e2e8f0",
        fontFamily: "Inter, system-ui, sans-serif",
        paddingBottom: 40,
      }}
    >
      <div style={{ background: "rgba(11,21,38,0.85)", borderBottom: "1px solid #1a2942", padding: "16px 16px 14px", backdropFilter: "blur(6px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <img
            src="/images/IM_703LaQuinta_Logo_full.png"
            alt="Ironman 70.3 La Quinta logo"
            style={{
              width: "min(300px, 80vw)",
              height: "auto",
              display: "block",
              marginBottom: 12,
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#f8fafc", letterSpacing: 0.4 }}>
            Ironman 70.3 Training Guide
          </div>
          <div style={{ color: "#94a3b8", marginTop: 6, fontSize: 15 }}>
            Built for consistency, race readiness, and long-term confidence.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {[
              { label: "La Quinta, CA · Dec 6, 2026", c: "#22d3ee" },
              { label: `${daysLeft} days to race`, c: "#fbbf24" },
              { label: "33 weeks · 5 days/week", c: "#86efac" },
            ].map((b, i) => (
              <span
                key={i}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: `${b.c}18`,
                  color: b.c,
                  border: `1px solid ${b.c}30`,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
            {Object.entries(DISC).map(([k, v]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: v.color }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: v.color, display: "inline-block" }} />
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 14px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: 8,
            marginTop: 16,
            overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "thin",
          }}
        >
          {PHASES.map((p) => {
            const on = activePh === p.id;
            return (
              <button
                key={p.id}
                onClick={() => switchPhase(p.id)}
                style={{
                  flex: "0 0 auto",
                  background: on ? p.accent : "transparent",
                  color: on ? "#000" : "#64748b",
                  border: `1px solid ${on ? p.accent : "#1e293b"}`,
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p.name}
                <span style={{ marginLeft: 5, fontWeight: 400, opacity: 0.75, fontSize: 13 }}>
                  Wk {p.wRange[0]}-{p.wRange[1]}
                </span>
              </button>
            );
          })}
        </div>

        {phase && (
          <div
            style={{
              marginTop: 12,
              borderRadius: 12,
              padding: "14px 16px",
              border: `1px solid ${phase.accent}28`,
              background: phase.accentBg,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, color: phase.accent, marginBottom: 3 }}>
              Phase {phase.id}: {phase.name} · {phase.dates}
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 10 }}>{phase.focus}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
              {[
                { title: "Phase milestones", body: phase.milestone },
                { title: "Coach's note", body: phase.note },
              ].map((box, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{box.title}</div>
                  <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{box.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#475569", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            Week:
          </span>
          {phaseWeeks.map((w) => {
            const isCur = w.wk === curWk;
            const isOn = w.wk === activeWk;
            return (
              <button
                key={w.wk}
                onClick={() => setActiveWk(w.wk)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isOn ? phase?.accent || "#22d3ee" : "transparent",
                  color: isOn ? "#000" : isCur ? phase?.accent || "#22d3ee" : "#475569",
                  border: `2px solid ${isOn ? phase?.accent || "#22d3ee" : isCur ? `${phase?.accent || "#22d3ee"}70` : "#1e293b"}`,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.12s",
                  position: "relative",
                }}
              >
                {w.wk}
                {isCur && !isOn && (
                  <span
                    style={{
                      position: "absolute",
                      top: 1,
                      right: 1,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: phase?.accent || "#22d3ee",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {week && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 20, color: "#f8fafc" }}>{week.theme}</span>
                <span style={{ marginLeft: 8, fontSize: 14, color: "#475569" }}>
                  Week {week.wk} · {formatWeekDateRange(week.wk)}
                </span>
              </div>
              {week.wk === curWk && (
                <span
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                    padding: "3px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Current week
                </span>
              )}
            </div>

            {week.callout && (
              <div
                style={{
                  background: "rgba(251,191,36,0.07)",
                  border: "1px solid rgba(251,191,36,0.18)",
                  borderRadius: 8,
                  padding: "9px 12px",
                  marginBottom: 10,
                  fontSize: 14,
                  color: "#fde68a",
                  lineHeight: 1.55,
                }}
              >
                {week.callout}
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(105px, 1fr))",
                  gap: 5,
                  minWidth: 680,
                }}
              >
                {weekDays.map((day, i) => (
                  <DayCard
                    key={i}
                    day={day}
                    label={getDayLabelWithDate(week.wk, i)}
                    onOpen={() => openDayModal(day, getDayLabelWithDate(week.wk, i))}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 8 }}>
              <button
                onClick={() => go(-1)}
                disabled={activeWk <= 1}
                style={{
                  background: "transparent",
                  border: "1px solid #1e293b",
                  color: activeWk <= 1 ? "#1e293b" : "#64748b",
                  padding: "7px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: activeWk <= 1 ? "default" : "pointer",
                }}
                >
                  {"<- Prev week"}
                </button>
              <div style={{ fontSize: 13, color: "#334155", alignSelf: "center" }}>
                {week.wk} of 33 · Phase {week.ph}
              </div>
              <button
                onClick={() => go(1)}
                disabled={activeWk >= 33}
                style={{
                  background: "transparent",
                  border: "1px solid #1e293b",
                  color: activeWk >= 33 ? "#1e293b" : "#64748b",
                  padding: "7px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: activeWk >= 33 ? "default" : "pointer",
                }}
                >
                  {"Next week ->"}
                </button>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 32,
            paddingTop: 14,
            borderTop: "1px solid #1e293b",
            fontSize: 13,
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          <div>
            Race distances: Swim 1.2 mi (1,931M) · Bike 56 mi · Run 13.1 mi (half marathon)
            <br />
            Weekly structure: Mon rest · Tue swim (AM) · Wed bike (AM) · Thu run + strength (PM) · Fri rest · Sat long ride/brick (AM) · Sun long run (AM)
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
              Sponsored By
            </div>

            <a href="https://www.plungepalz.com/" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/PlungePalz_Logo_ForShare.png"
                alt="PlungePalz logo"
                style={{
                  width: "min(500px, 100%)",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </a>

            <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
              Record, track, share, and earn for your Contrast Therapy activities
            </div>

            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <a href="https://apps.apple.com/us/app/plungepalz/id6744040589" target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/Download_App_Store.png"
                  alt="Download on the App Store"
                  style={{ width: "min(250px, 90vw)", height: "auto", display: "block" }}
                />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.PlungePalz.app" target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/Download_Google_Play_Store.png"
                  alt="Get it on Google Play"
                  style={{ width: "min(250px, 90vw)", height: "auto", display: "block" }}
                />
              </a>
            </div>

            <a
              href="https://www.plungepalz.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#f8fafc",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <img
                src="/images/website_link.png"
                alt=""
                aria-hidden
                style={{ width: 22, height: 22, objectFit: "contain" }}
              />
              Visit PlungePalz.com for more info
            </a>
          </div>
        </div>
      </div>

      {modalDay && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDayModal();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.7)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "min(560px, 100%)",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: 14,
              border: `1px solid ${modalDisc.color}55`,
              background: "#0b1526",
              padding: "16px 16px 14px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "#f8fafc", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  {modalDayLabel}
                </div>
                <div style={{ marginTop: 4, fontSize: 20, fontWeight: 700, color: "#f8fafc", lineHeight: 1.3 }}>
                  {modalDay.title}
                </div>
              </div>
              <button
                onClick={closeDayModal}
                style={{
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "#cbd5e1",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  fontSize: 18,
                  lineHeight: 1,
                  fontWeight: 700,
                }}
                aria-label="Close details modal"
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: 12, display: "inline-block", fontSize: 12, fontWeight: 700, color: modalDisc.color, background: `${modalDisc.color}20`, borderRadius: 999, padding: "4px 10px" }}>
              {modalDisc.label}
            </div>

            {modalDay.time && <div style={{ marginTop: 10, fontSize: 13, color: "#94a3b8" }}>{modalDay.time}</div>}

            <div style={{ marginTop: 10, fontSize: 15, color: "#e2e8f0", lineHeight: 1.7 }}>
              {modalDetailItems.length > 1 ? (
                <ul style={{ margin: "0 0 0 18px", padding: 0 }}>
                  {modalDetailItems.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                modalDay.detail
              )}
            </div>

            {modalDay.flag && (
              <div style={{ marginTop: 12, display: "inline-block", fontSize: 12, fontWeight: 700, color: modalDisc.color, background: `${modalDisc.color}20`, borderRadius: 8, padding: "5px 10px" }}>
                {modalDay.flag}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
