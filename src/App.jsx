import { useState, useRef, useMemo } from "react";

const RECIPES = [
  { id: 1, name: "Cinnamon Banana Porridge", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [10, 5, 3], m: "100g oats in 300ml water. Top with half a sliced banana, generous cinnamon, pinch of nutmeg.", t: "Mash the banana into the hot oats for a creamier texture.", i: [{ n: "banana", c: "fruit" }, { n: "cinnamon", c: "pantry" }, { n: "nutmeg", c: "pantry" }] },
  { id: 2, name: "Chocolate Porridge", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [9, 4, 5], m: "100g oats in 300ml water. Stir through a tablespoon of raw cacao powder and half a mashed banana.", t: "Tastes like dessert. Best deployed as a day-two morale booster.", i: [{ n: "raw cacao powder", c: "pantry" }, { n: "banana", c: "fruit" }] },
  { id: 3, name: "Apple Pie Porridge", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [7, 5, 8], m: "Grate one small apple into 300ml simmering water. Add 100g oats, cinnamon, a pinch of ground ginger, scrape of vanilla paste. Cook until the apple breaks down.", t: "Use a tart apple (Granny Smith) to cut through the sweetness.", i: [{ n: "apple", c: "fruit" }, { n: "cinnamon", c: "pantry" }, { n: "ground ginger", c: "pantry" }, { n: "vanilla paste", c: "pantry" }] },
  { id: 4, name: "Berry & Cinnamon Oats", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [10, 5, 3], m: "100g oats in 300ml water with cinnamon. Top with a small handful of fresh or frozen blueberries and raspberries.", t: "Stir frozen berries through hot oats. They burst and create a natural sauce.", i: [{ n: "mixed berries", c: "fruit" }, { n: "cinnamon", c: "pantry" }] },
  { id: 5, name: "Pear & Cardamom", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [5, 4, 9], m: "Dice half a ripe pear into 300ml simmering water with 2 crushed cardamom pods. Add 100g oats and cook until the pear softens. Remove the pods before eating.", t: "Cardamom transforms plain oats into something that smells like a bakery.", i: [{ n: "pear", c: "fruit" }, { n: "cardamom pods", c: "pantry" }] },
  { id: 6, name: "Stewed Rhubarb Oats", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [3, 3, 10], m: "Chop two stalks of rhubarb and simmer in a few tablespoons of water until soft. Cook 100g oats separately in 300ml water. Spoon the stewed rhubarb on top with cinnamon.", t: "The tartness makes this feel like a completely different meal.", i: [{ n: "rhubarb", c: "fruit" }, { n: "cinnamon", c: "pantry" }] },
  { id: 7, name: "Spiced Orange Porridge", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [8, 6, 5], m: "Zest half an orange into 300ml water. Simmer a few orange segments briefly, then add 100g oats, a pinch of cinnamon, a pinch of cloves. Cook until creamy. Finish with the zest on top.", t: "The zest does the heavy lifting. Don't skip it.", i: [{ n: "orange", c: "fruit" }, { n: "cinnamon", c: "pantry" }, { n: "cloves", c: "pantry" }] },
  { id: 8, name: "Mango & Lime", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [9, 7, 3], m: "100g oats in 300ml water. Stir through diced fresh mango (or thawed frozen). Squeeze a wedge of lime over the top.", t: "The lime lifts this from porridge to tropical. A pinch of chilli flakes works too.", i: [{ n: "mango", c: "fruit" }, { n: "lime", c: "fruit" }] },
  { id: 9, name: "Roasted Plum & Vanilla", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [3, 3, 10], m: "Halve 2 plums and roast cut-side down in a dry pan until caramelised (no oil needed). Cook 100g oats in 300ml water with a scrape of vanilla paste. Top with the warm plums.", t: "The dry pan caramelisation gives sweetness without any sugar.", i: [{ n: "plums", c: "fruit" }, { n: "vanilla paste", c: "pantry" }] },
  { id: 10, name: "Toasted Coconut & Passionfruit", type: "sweet", diet: "vegan", r: "1:3", w: 300, f: [9, 6, 3], m: "Toast a tablespoon of desiccated coconut in a dry pan until golden (watch it, it burns fast). Cook 100g oats in 300ml water. Top with the toasted coconut and the pulp of one passionfruit.", t: "Toasting the coconut is the difference between cardboard and caramel.", i: [{ n: "desiccated coconut", c: "pantry" }, { n: "passionfruit", c: "fruit" }] },
  { id: 11, name: "Mushroom & Thyme Risotto Oats", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [2, 5, 10], m: "Soften sliced mushrooms in a splash of water. Add 200ml water, a veg stock cube. Stir in 100g oats. Cook thick. Finish with fresh thyme, salt, pepper.", t: "Eat with a fork, not a spoon. Think risotto, not porridge.", i: [{ n: "mushrooms", c: "veg" }, { n: "veg stock cube", c: "pantry" }, { n: "fresh thyme", c: "herbs" }] },
  { id: 12, name: "Tomato, Miso & Basil", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [2, 9, 6], m: "Chop a fresh tomato into 200ml simmering water with a teaspoon of miso paste. Add 100g oats, cook until thick. Finish with fresh basil, salt, cracked pepper.", t: "The miso adds umami depth that makes this taste like actual food.", i: [{ n: "tomato", c: "veg" }, { n: "miso paste", c: "pantry" }, { n: "fresh basil", c: "herbs" }] },
  { id: 13, name: "Spring Onion & Ginger Congee", type: "savoury", diet: "vegan", r: "1:3", w: 300, f: [3, 8, 7], m: "Dissolve a veg stock cube in 300ml water. Add finely grated fresh ginger. Stir in 100g oats and cook loose, like soup. Top with sliced spring onion and white pepper.", t: "Go wetter than the other savoury ones. Congee consistency.", i: [{ n: "fresh ginger", c: "veg" }, { n: "spring onion", c: "veg" }, { n: "veg stock cube", c: "pantry" }, { n: "white pepper", c: "pantry" }] },
  { id: 14, name: "Roasted Capsicum & Smoked Paprika", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [2, 9, 6], m: "Dissolve a stock cube in 200ml water. Add 100g oats, a teaspoon of smoked paprika, cook until thick. Stir through roughly chopped roasted capsicum (jarred is fine, drained).", t: "Smoked paprika is doing all the work. Be generous.", i: [{ n: "roasted capsicum (jarred)", c: "pantry" }, { n: "smoked paprika", c: "pantry" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 15, name: "Spinach, Nutmeg & Lemon", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [2, 8, 7], m: "Wilt a handful of fresh spinach and stir through fully. Add 200ml water, stock cube, 100g oats. Cook thick. Finish with freshly grated nutmeg, a squeeze of lemon, salt, pepper.", t: "Stir the spinach through completely so it colours the oats green.", i: [{ n: "fresh spinach", c: "veg" }, { n: "lemon", c: "fruit" }, { n: "nutmeg", c: "pantry" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 16, name: "Cumin, Carrot & Coriander", type: "savoury", diet: "vegan", r: "1:2.5", w: 250, f: [2, 5, 9], m: "Grate one small carrot into 250ml water with a stock cube and half a teaspoon of ground cumin. Add 100g oats, cook until thick. Top with fresh coriander and a squeeze of lemon.", t: "The lemon at the end lifts the whole thing. Don't skip it.", i: [{ n: "carrot", c: "veg" }, { n: "fresh coriander", c: "herbs" }, { n: "ground cumin", c: "pantry" }, { n: "lemon", c: "fruit" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 17, name: "Leek & Mustard", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [1, 4, 10], m: "Finely slice half a leek and soften in a splash of water. Add 200ml water, a stock cube, 100g oats. Cook thick. Stir through half a teaspoon of Dijon mustard, salt, pepper.", t: "Tastes oddly like a pie filling without the pastry.", i: [{ n: "leek", c: "veg" }, { n: "Dijon mustard", c: "pantry" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 18, name: "Charred Corn & Chilli", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [2, 7, 8], m: "Char corn kernels in a dry pan until blackened in spots. Cook 100g oats in 200ml water with a stock cube, adding the corn for the last minute. Squeeze of lime, pinch of chilli flakes, salt.", t: "The charring adds a smoky sweetness that's surprisingly addictive.", i: [{ n: "corn kernels", c: "veg" }, { n: "lime", c: "fruit" }, { n: "chilli flakes", c: "pantry" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 19, name: "Pea, Mint & Lemon", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [2, 9, 5], m: "Cook 100g oats in 200ml water with a stock cube. Stir through a handful of peas (frozen is fine), torn fresh mint, lemon zest, salt, pepper.", t: "Bright and fresh. The closest you'll get to eating a salad.", i: [{ n: "frozen peas", c: "veg" }, { n: "fresh mint", c: "herbs" }, { n: "lemon", c: "fruit" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 20, name: "Soy, Sesame & Spring Onion", type: "savoury", diet: "vegan", r: "1:2.5", w: 250, f: [3, 8, 7], m: "Cook 100g oats in 250ml water with a splash of soy sauce until loose and creamy. Top with finely sliced spring onion, a few drops of sesame oil, and sesame seeds.", t: "Minimum sesame oil. A few drops for flavour, not a glug.", i: [{ n: "spring onion", c: "veg" }, { n: "soy sauce", c: "pantry" }, { n: "sesame oil", c: "pantry" }, { n: "sesame seeds", c: "pantry" }] },
  { id: 21, name: "Turmeric, Cauliflower & Za'atar", type: "savoury", diet: "vegan", r: "1:2", w: 200, f: [1, 5, 10], m: "Break a few small cauliflower florets and char in a dry pan. Cook 100g oats in 200ml water with a stock cube and half a teaspoon of turmeric. Top with charred cauliflower, za'atar, salt.", t: "The turmeric turns this golden and the za'atar adds Middle Eastern depth.", i: [{ n: "cauliflower", c: "veg" }, { n: "za'atar", c: "pantry" }, { n: "turmeric", c: "pantry" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 22, name: "Savoury Stock & Soft Egg", type: "savoury", diet: "vegetarian", r: "1:2.5", w: 250, f: [8, 7, 6], m: "Cook 100g oats in 250ml water with a veg stock cube until thick and creamy. Top with a soft-boiled egg (6 minutes), halved. Salt, pepper, and fresh chives.", t: "The runny yolk mixes into the oats like a sauce. Your savoury breakfast option.", i: [{ n: "egg", c: "dairy" }, { n: "fresh chives", c: "herbs" }, { n: "veg stock cube", c: "pantry" }] },
  { id: 23, name: "Smoked Salmon & Dill", type: "savoury", diet: "fish", r: "1:2.5", w: 250, f: [7, 8, 4], m: "Cook 100g oats in 250ml water with a pinch of salt until creamy. Lay a small amount of smoked salmon on top. Finish with fresh dill, cracked pepper, squeeze of lemon.", t: "Keep the salmon portion small. It's a flavour accent, not the main event.", i: [{ n: "smoked salmon", c: "protein" }, { n: "fresh dill", c: "herbs" }, { n: "lemon", c: "fruit" }] },
  { id: 24, name: "Chicken Broth & Ginger Congee", type: "savoury", diet: "meat", r: "1:3", w: 300, f: [3, 5, 10], m: "Simmer 100g oats in 300ml chicken bone broth with grated fresh ginger. Cook loose. Top with sliced spring onion, white pepper, and a few shreds of leftover cooked chicken.", t: "Bone broth adds depth and protein. Comfort food for day two.", i: [{ n: "chicken bone broth", c: "protein" }, { n: "cooked chicken", c: "protein" }, { n: "fresh ginger", c: "veg" }, { n: "spring onion", c: "veg" }, { n: "white pepper", c: "pantry" }] },
  { id: 25, name: "Chorizo & Roasted Capsicum", type: "savoury", diet: "meat", r: "1:2", w: 200, f: [1, 3, 10], m: "Dry-fry 2-3 thin slices of chorizo until crisp (no oil needed). Remove and drain. Cook 100g oats in 200ml water with smoked paprika. Top with crisp chorizo and roasted capsicum.", t: "Minimum chorizo. Two or three thin slices is enough for flavour.", i: [{ n: "chorizo", c: "protein" }, { n: "roasted capsicum (jarred)", c: "pantry" }, { n: "smoked paprika", c: "pantry" }] },
];

const FAQ = [
  { q: "Is a 10% LDL reduction actually meaningful?", a: "Yes. Every 1 mmol/L reduction in LDL correlates with a 20-25% reduction in cardiovascular events. A 10% drop from 48 hours is comparable to what most people achieve through an entire lifestyle overhaul." },
  { q: "Will I be miserable for two days?", a: "That's the point of the meal planner. You're eating chocolate porridge, mushroom risotto, miso and tomato oats. The recipes are designed to make the 48 hours genuinely enjoyable." },
  { q: "Can I add things to the oats?", a: "Small amounts of fruit, vegetables, herbs, spices, stock cubes, and miso paste are all fine. Avoid butter, oil, coconut cream, sugar, milk, and processed toppings." },
  { q: "What about meat or fish?", a: "The study was oats-only, but a very small amount of lean protein as a flavour accent keeps the oats as the base while making things more sustainable. Keep portions minimal." },
  { q: "Should I do this instead of taking statins?", a: "No. This is not a substitute for prescribed medication. Statins can reduce LDL by 50% or more. The oat reset is a complementary intervention. Always talk to your doctor." },
  { q: "How often should I do it?", a: "The researchers suggested every six weeks could maintain the benefits, though this hasn't been confirmed in follow-up trials yet. We'll send you a reminder at 5.5 weeks if you sign up." },
  { q: "I'm vegan but my cholesterol is high. How?", a: "Being vegan doesn't automatically mean low cholesterol. Coconut oil, palm oil in processed foods, and refined carbohydrates can all push LDL up. This could be a useful tool alongside cleaning up your overall diet." },
  { q: "What can I drink during the reset?", a: "Skip anything with calories: no soft drinks, juice, alcohol, or milk. Black coffee and plain teas are both fine and come with their own well-documented health benefits. Herbal teas, green tea, and plain sparkling water all work too. And, of course, water." },
  { q: "Is this safe?", a: "For most people, two days of oats is completely safe. If you have coeliac disease, a diagnosed eating disorder, diabetes, or any condition requiring careful dietary management, speak to your doctor first." },
  { q: "Can I keep eating these recipes normally?", a: "Absolutely. They're designed to be low in fat, sugar, and cholesterol for the reset, but they work as everyday meals. Outside the reset, add feta, olive oil, a poached egg, whatever you like." },
];

const STUDIES = [
  { title: "Klumpen et al.", year: "2026", desc: "Two-day high-dose oat intervention reduced LDL by 10% in people with metabolic syndrome. Effects persisted for six weeks.", url: "https://www.nature.com/articles/s41467-026-68303-9", pub: "Nature Communications" },
  { title: "Ho et al.", year: "2016", desc: "Meta-analysis of 58 RCTs, 3,974 participants. Oat beta-glucan significantly lowers LDL, non-HDL cholesterol, and apolipoprotein B.", url: "https://pubmed.ncbi.nlm.nih.gov/27724985/", pub: "British Journal of Nutrition" },
  { title: "Whitehead et al.", year: "2014", desc: "28 RCTs. 3g+ of oat beta-glucan per day reduces LDL by 0.25 mmol/L and total cholesterol by 0.30 mmol/L.", url: "https://pubmed.ncbi.nlm.nih.gov/25411276/", pub: "American Journal of Clinical Nutrition" },
  { title: "Yu et al.", year: "2022", desc: "Systematic review focused on hypercholesterolaemic adults. Confirmed significant reductions in total and LDL cholesterol.", url: "https://pubmed.ncbi.nlm.nih.gov/35631184/", pub: "Nutrients" },
  { title: "US FDA Health Claim", year: "1997", desc: "First government-approved health claim linking a specific food to disease prevention. 3g/day oat beta-glucan for heart disease risk reduction.", url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-E/section-101.81", pub: "21 CFR 101.81" },
  { title: "EFSA Scientific Opinion", year: "2010", desc: "Concluded a cause and effect relationship between oat beta-glucan and lowering blood LDL cholesterol.", url: "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2010.1885", pub: "EFSA Journal" },
  { title: "Joyce et al.", year: "2019", desc: "Comprehensive review of cholesterol-lowering mechanisms including bile acid metabolism and the gut microbiome.", url: "https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2019.00171/full", pub: "Frontiers in Nutrition" },
];

const PRESS = [
  { pub: "Newsweek", title: "Scientists Reveal Two-Day Diet That Slashes Cholesterol for Weeks", desc: "The results suggest that a short, intensive oat reset, paired with temporary calorie reduction, may be more effective than sprinkling small amounts of oats into an otherwise unchanged diet.", url: "https://www.newsweek.com/scientists-reveal-two-day-diet-slashes-cholesterol-weeks-bacteria-oatmeal-11418144", date: "Jan 2026" },
  { pub: "US News & World Report", title: "Two Days of Oatmeal May Lower Cholesterol, Study Finds", desc: "People with metabolic syndrome who followed a strict oat-based plan for 48 hours saw a 10% drop in harmful LDL cholesterol. The improvement was still noticeable six weeks later.", url: "https://www.usnews.com/news/health-news/articles/2026-03-04/two-days-of-oatmeal-may-lower-cholesterol-study-finds", date: "Mar 2026" },
  { pub: "ScienceAlert", title: "48-Hour Oatmeal Diet Could Cut Cholesterol Levels For Weeks, Study Shows", desc: "LDL levels were down around 10% significantly more than those in the control group. The study found evidence that the oat diet increases gut bacteria that produce compounds linked to improved cholesterol metabolism.", url: "https://www.sciencealert.com/48-hour-oatmeal-diet-could-cut-cholesterol-levels-for-weeks-study-shows", date: "Feb 2026" },
  { pub: "SciTechDaily", title: "This Simple 48-Hour Diet Cut Harmful Cholesterol by 10%, Study Finds", desc: "A very short dietary intervention built around oats may deliver meaningful improvements in cholesterol levels. The improvement was still present six weeks later, suggesting the effects were not simply temporary.", url: "https://scitechdaily.com/this-simple-48-hour-diet-cut-harmful-cholesterol-by-10-study-finds/", date: "Jan 2026" },
  { pub: "The Healthy", title: "Eating Oatmeal Just This Many Days in a Row Improved Cholesterol and Gut Health", desc: "Scientists at Germany's University of Bonn tested what would happen if oatmeal were all an individual ate for 48 hours. The short, high-dose approach outperformed six weeks of moderate daily intake.", url: "https://www.thehealthy.com/news/oatmeal-cholesterol-gut-health-university-of-bonn-study-2026/", date: "Mar 2026" },
  { pub: "ScienceDaily", title: "Just two days of oatmeal cut bad cholesterol by 10%", desc: "Participants followed a calorie restricted plan made up almost entirely of oatmeal for 48 hours. The reduction remained noticeable even six weeks later. Researchers found that the diet changed the balance of bacteria in the gut.", url: "https://www.sciencedaily.com/releases/2026/02/260225081217.htm", date: "Feb 2026" },
  { pub: "University of Bonn", title: "Two days of oatmeal reduce cholesterol level", desc: "The original press release from the research team. The participants consumed a calorie-reduced diet, consisting almost exclusively of oatmeal, for two days. Even after six weeks, the effect remained stable.", url: "https://www.uni-bonn.de/en/news/017-2026", date: "Feb 2026" },
];



const getRecipe = (id) => RECIPES.find((r) => r.id === id);
const dietLabel = (d) => ({ vegan: "Vegan", vegetarian: "Vegetarian", fish: "Contains fish", meat: "Contains meat" }[d] || "");

const SLOT_NAMES = ["Breakfast", "Lunch", "Dinner", "Breakfast", "Lunch", "Dinner"];
const SLOT_FIT = [0, 1, 2, 0, 1, 2];

function scheduleMeals(ids) {
  const meals = ids.map(getRecipe);
  if (meals.length !== 6 || meals.some((m) => !m)) return [];
  const perms = [];
  const gen = (rem, cur = []) => { if (!rem.length) { perms.push(cur); return; } for (let i = 0; i < rem.length; i++) gen([...rem.slice(0, i), ...rem.slice(i + 1)], [...cur, rem[i]]); };
  gen([0, 1, 2, 3, 4, 5]);
  let best = -1, bp = null;
  for (const p of perms) {
    let s = 0;
    for (let i = 0; i < 6; i++) s += meals[p[i]].f[SLOT_FIT[i]];
    const d1 = new Set([meals[p[0]].type, meals[p[1]].type, meals[p[2]].type]);
    const d2 = new Set([meals[p[3]].type, meals[p[4]].type, meals[p[5]].type]);
    if (d1.size > 1) s += 3;
    if (d2.size > 1) s += 3;
    if (s > best) { best = s; bp = p; }
  }
  if (!bp) return [];
  return bp.map((mi, si) => ({ meal: meals[mi], slot: SLOT_NAMES[si], day: si < 3 ? 1 : 2 }));
}

const CAT_ORDER = ["oats", "fruit", "veg", "herbs", "dairy", "protein", "pantry"];
const CAT_LABELS = { oats: "Oats", fruit: "Fruit", veg: "Vegetables", herbs: "Fresh Herbs", dairy: "Dairy & Eggs", protein: "Meat & Fish", pantry: "Pantry Staples" };

function buildShoppingList(ids) {
  const items = { "rolled oats (600g)": "oats" };
  ids.forEach((id) => { const r = getRecipe(id); if (r) r.i.forEach((x) => { items[x.n] = x.c; }); });
  items["salt & pepper"] = "pantry";
  const g = {}; CAT_ORDER.forEach((c) => { g[c] = []; });
  Object.entries(items).forEach(([n, c]) => { if (!g[c]) g[c] = []; g[c].push(n); });
  CAT_ORDER.forEach((c) => { g[c].sort(); });
  return g;
}

function filterRecipes(tf, df) {
  return RECIPES.filter((r) => {
    if (tf !== "all" && r.type !== tf) return false;
    if (df === "vegan" && r.diet !== "vegan") return false;
    if (df === "vegetarian" && (r.diet === "meat" || r.diet === "fish")) return false;
    return true;
  });
}

export default function App() {
  const [sel, setSel] = useState([]);
  const [tf, setTf] = useState("all");
  const [df, setDf] = useState("all");
  const [showPlan, setShowPlan] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const plannerRef = useRef(null);
  const planRef = useRef(null);

  const filtered = filterRecipes(tf, df);
  const scheduled = useMemo(() => sel.length === 6 ? scheduleMeals(sel) : [], [sel]);
  const shopping = useMemo(() => sel.length === 6 ? buildShoppingList(sel) : null, [sel]);
  const day1 = scheduled.filter((s) => s.day === 1);
  const day2 = scheduled.filter((s) => s.day === 2);
  const validPlan = showPlan && scheduled.length === 6 && shopping;

  const toggle = (id) => {
    setSel((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length < 6) return [...prev, id];
      return prev;
    });
    setShowPlan(false);
  };

  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

  return (
    <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", background: "#FAFAF7", color: "#1A1A1A", minHeight: "100vh" }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600;8..60,700;8..60,800&family=Outfit:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
::selection { background: rgba(212, 160, 23, 0.15); }
.wrap { max-width: 700px; margin: 0 auto; padding: 0 24px; }

/* ══ HERO ══ */
.hero { padding: 72px 24px 56px; max-width: 700px; margin: 0 auto; text-align: center; }
.hero-brand {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(32px, 6vw, 52px);
  font-weight: 800; letter-spacing: 3px;
  text-transform: uppercase; color: #D4A017;
  margin-bottom: 20px; display: block; line-height: 1.05;
}
.hero h1 {
  font-size: clamp(22px, 3.5vw, 32px); font-weight: 600;
  line-height: 1.2; letter-spacing: -0.3px; color: #666; margin-bottom: 20px;
}
.hero h1 em { font-style: normal; color: #D4A017; }
.hero-sub {
  font-family: 'Outfit', sans-serif; font-size: 16px; line-height: 1.6;
  color: #777; margin-bottom: 40px; max-width: 440px; margin-left: auto; margin-right: auto;
}
.hero-trio { display: flex; justify-content: center; gap: 48px; margin-bottom: 16px; }
.hero-trio-item { text-align: center; }
.hero-trio-num { font-size: clamp(36px, 6vw, 48px); font-weight: 700; line-height: 1; letter-spacing: -1.5px; color: #D4A017; }
.hero-trio-label { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #999; margin-top: 8px; }
.hero-trio-context {
  font-family: 'Outfit', sans-serif; font-size: 13px; color: #aaa;
  line-height: 1.65; max-width: 460px; margin: 0 auto 40px; font-style: italic;
}
.hero-cta {
  font-family: 'Outfit', sans-serif; display: inline-block;
  background: #1A1A1A; color: #FAFAF7; font-size: 14px; font-weight: 600;
  padding: 16px 40px; border: none; cursor: pointer; letter-spacing: 0.5px; transition: background 0.15s;
}
.hero-cta:hover { background: #333; }
.hero-evidence {
  font-family: 'Outfit', sans-serif; font-size: 12px; color: #bbb; line-height: 1.7;
  margin-top: 32px; max-width: 520px; margin-left: auto; margin-right: auto;
}
.hero-evidence a { color: #999; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #ddd; }
.hero-evidence a:hover { color: #1A1A1A; text-decoration-color: #1A1A1A; }



/* ══ SECTIONS ══ */
.sec { padding: 64px 0; border-top: 1px solid #E8E3DA; }
.sec-label {
  font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase; color: #D4A017; margin-bottom: 16px;
}
.sec-title { font-size: clamp(28px, 4.5vw, 38px); font-weight: 700; line-height: 1.12; letter-spacing: -0.8px; color: #1A1A1A; margin-bottom: 20px; }
.sec-body { font-family: 'Outfit', sans-serif; font-size: 15px; line-height: 1.8; color: #555; margin-bottom: 16px; }
.sec-body a { color: #777; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #ccc; }
.sec-body a:hover { color: #1A1A1A; text-decoration-color: #1A1A1A; }

/* ══ FILTERS ══ */
.filters { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.fbtn {
  font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500;
  padding: 7px 16px; border: 1px solid #D5D0C6; border-radius: 4px;
  background: transparent; color: #777; cursor: pointer; transition: all 0.12s;
}
.fbtn:hover { border-color: #1A1A1A; color: #1A1A1A; }
.fbtn.on { background: #1A1A1A; color: #FAFAF7; border-color: #1A1A1A; }
.fsep { width: 1px; background: #D5D0C6; margin: 0 6px; }
.counter { font-family: 'Outfit', sans-serif; font-size: 13px; color: #999; margin-bottom: 20px; }
.counter strong { color: #1A1A1A; font-weight: 600; }
.planner-meta {
  font-family: 'Outfit', sans-serif; font-size: 13px; color: #aaa;
  margin-bottom: 24px; line-height: 1.6;
}

/* ══ RECIPE GRID ══ */
.rgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.rcard {
  background: #FFFFFF; border: 1px solid #DDD8CE; border-radius: 8px;
  padding: 18px 20px; cursor: pointer; transition: all 0.15s;
  position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.rcard:hover { border-color: #B5AFA3; box-shadow: 0 3px 12px rgba(0,0,0,0.07); transform: translateY(-1px); }
.rcard.sel { border-color: #1A1A1A; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.rcard.sel::after {
  content: '\\2713'; position: absolute; top: 14px; right: 14px;
  font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700;
  width: 22px; height: 22px; background: #1A1A1A; color: #FAFAF7;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.rcard.dis { opacity: 0.3; cursor: default; }
.rcard.dis:hover { border-color: #DDD8CE; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transform: none; }
.rcard-type { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 7px; }
.rcard-type.sweet { color: #C49A2A; }
.rcard-type.savoury { color: #6B8F6B; }
.rcard-name { font-size: 15px; font-weight: 700; line-height: 1.3; color: #1A1A1A; margin-bottom: 7px; padding-right: 28px; }
.rcard-ingredients { font-family: 'Outfit', sans-serif; font-size: 12px; line-height: 1.5; color: #aaa; margin-bottom: 8px; }
.rcard-tip { font-family: 'Outfit', sans-serif; font-size: 12px; line-height: 1.5; color: #999; margin-bottom: 10px; font-style: italic; }
.rcard-diet { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.5px; color: #ccc; }

/* ══ STICKY BAR ══ */
.sbar { position: sticky; bottom: 0; z-index: 10; background: linear-gradient(to top, #FAFAF7 50%, transparent); padding: 24px 0 32px; text-align: center; }
.sbar-btn {
  font-family: 'Outfit', sans-serif; background: #1A1A1A; color: #FAFAF7;
  font-size: 14px; font-weight: 600; padding: 16px 40px; border: none; cursor: pointer;
  letter-spacing: 0.5px; transition: background 0.15s; box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.sbar-btn:hover { background: #333; }
.sbar-btn:disabled { opacity: 0.2; cursor: default; box-shadow: none; }

/* ══ PLAN OUTPUT ══ */
.plan-wrapper { border: 1px solid #E0DBD2; border-radius: 8px; overflow: hidden; margin: 32px 0 48px; }
.plan-day-header { background: #1A1A1A; padding: 14px 28px; display: flex; align-items: baseline; gap: 12px; }
.plan-day-name { font-size: 17px; font-weight: 700; color: #FAFAF7; letter-spacing: -0.2px; }
.plan-day-sub { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #D4A017; }
.plan-meal { padding: 20px 28px; border-bottom: 1px solid #F0ECE4; display: grid; grid-template-columns: 76px 1fr; gap: 0 16px; }
.plan-meal:last-child { border-bottom: none; }
.plan-slot { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ccc; padding-top: 3px; }
.plan-meal h4 { font-size: 17px; font-weight: 700; color: #1A1A1A; margin-bottom: 3px; line-height: 1.2; }
.plan-ratio { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500; color: #bbb; margin-bottom: 8px; }
.plan-ingredients-list {
  font-family: 'Outfit', sans-serif; font-size: 12px; color: #aaa;
  margin-bottom: 10px; line-height: 1.5;
}
.plan-ingredients-list strong { color: #999; font-weight: 600; }
.plan-meal p { font-family: 'Outfit', sans-serif; font-size: 14px; line-height: 1.7; color: #555; }
.plan-tip { font-family: 'Outfit', sans-serif; font-size: 12px; color: #999; margin-top: 6px; font-style: italic; }
.plan-day-divider { height: 1px; background: #E8E3DA; }

/* ══ SHOPPING ══ */
.shop { background: #FAFAF7; border: 1px solid #E0DBD2; border-radius: 8px; padding: 32px 36px; margin: 0 0 48px; }
.shop-title { font-size: 20px; font-weight: 700; color: #1A1A1A; margin-bottom: 4px; }
.shop-subtitle { font-family: 'Outfit', sans-serif; font-size: 13px; color: #aaa; margin-bottom: 28px; }
.shop-cat { margin-bottom: 20px; }
.shop-cat:last-child { margin-bottom: 0; }
.shop-cat-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #999; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #F0ECE4; }
.shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; }
.shop-item { font-family: 'Outfit', sans-serif; font-size: 14px; color: #444; padding: 4px 0; display: flex; align-items: center; gap: 8px; }
.shop-item::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #D5D0C6; flex-shrink: 0; }
.shop-item.hl { color: #C49A2A; font-weight: 600; }
.shop-item.hl::before { background: #D4A017; }

/* ══ EVIDENCE ══ */
.ev-row { display: flex; gap: 40px; margin: 32px 0; flex-wrap: wrap; }
.ev-num { font-size: 36px; font-weight: 700; color: #1A1A1A; line-height: 1; letter-spacing: -1px; }
.ev-label { font-family: 'Outfit', sans-serif; font-size: 11px; color: #999; margin-top: 4px; }

/* ══ PRESS ARTICLES ══ */
.press-item { padding: 20px 0; border-bottom: 1px solid #F0ECE4; }
.press-item:last-child { border-bottom: none; }
.press-item-pub {
  font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase; color: #D4A017; margin-bottom: 6px;
}
.press-item-title { font-size: 17px; font-weight: 700; color: #1A1A1A; line-height: 1.3; margin-bottom: 6px; }
.press-item-desc { font-family: 'Outfit', sans-serif; font-size: 13px; line-height: 1.65; color: #777; margin-bottom: 8px; }
.press-item-footer { display: flex; align-items: center; gap: 16px; }
.press-item-date { font-family: 'Outfit', sans-serif; font-size: 11px; color: #bbb; }
.press-item-link { font-family: 'Outfit', sans-serif; font-size: 12px; color: #999; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #ddd; }
.press-item-link:hover { color: #1A1A1A; text-decoration-color: #1A1A1A; }

/* ══ FAQ ══ */
.faq-item { border-bottom: 1px solid #E8E3DA; }
.faq-q { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500; color: #1A1A1A; padding: 20px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 20px; background: none; border: none; width: 100%; text-align: left; }
.faq-q:hover { color: #555; }
.faq-arrow { font-size: 16px; color: #ccc; transition: transform 0.2s; flex-shrink: 0; }
.faq-arrow.open { transform: rotate(45deg); }
.faq-a { font-family: 'Outfit', sans-serif; font-size: 14px; line-height: 1.75; color: #666; padding: 0 0 20px; }

/* ══ STUDIES ══ */
.study-item { padding: 16px 0; border-bottom: 1px solid #F0ECE4; }
.study-item:last-child { border-bottom: none; }
.study-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
.study-title { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #1A1A1A; }
.study-year { font-family: 'Outfit', sans-serif; font-size: 12px; color: #bbb; }
.study-pub { font-family: 'Outfit', sans-serif; font-size: 11px; color: #bbb; font-style: italic; margin-bottom: 4px; }
.study-desc { font-family: 'Outfit', sans-serif; font-size: 13px; line-height: 1.6; color: #666; margin-bottom: 4px; }
.study-link { font-family: 'Outfit', sans-serif; font-size: 12px; color: #999; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #ddd; }
.study-link:hover { color: #1A1A1A; text-decoration-color: #1A1A1A; }

/* ══ FOOTER ══ */
.footer { text-align: center; padding: 56px 24px; border-top: 1px solid #E8E3DA; }
.footer p { font-family: 'Outfit', sans-serif; font-size: 12px; color: #bbb; line-height: 1.65; margin-bottom: 6px; }
.reset-btn { font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500; color: #999; background: none; border: 1px solid #D5D0C6; border-radius: 4px; padding: 8px 20px; cursor: pointer; transition: all 0.12s; }
.reset-btn:hover { border-color: #1A1A1A; color: #1A1A1A; }

/* ══ RESPONSIVE ══ */
@media (max-width: 600px) {
  .rgrid, .shop-grid { grid-template-columns: 1fr; }
  .hero-trio { gap: 24px; }
  .hero-trio-num { font-size: 36px; letter-spacing: -1px; }
  .ev-row { gap: 24px; }
  .hero { padding: 56px 20px 40px; }
  .wrap { padding: 0 20px; }
  .shop { padding: 24px 20px; }
  .plan-meal { grid-template-columns: 1fr; gap: 4px; }
  .plan-slot { padding-top: 0; }
  .press-logo-row { gap: 24px; }
}
      `}</style>

      {/* ═══ HERO ═══ */}
      <div className="hero">
        <span className="hero-brand">48HR Oat Reset</span>
        <h1>Lower your cholesterol<br />in <em>48 hours</em></h1>
        <p className="hero-sub">Two days of oat-based meals. 25 recipes that don't taste like punishment. Measurable results backed by decades of science.</p>

        <div className="hero-trio">
          <div className="hero-trio-item">
            <div className="hero-trio-num">10%</div>
            <div className="hero-trio-label">LDL drop</div>
          </div>
          <div className="hero-trio-item">
            <div className="hero-trio-num">2kg</div>
            <div className="hero-trio-label">Weight lost</div>
          </div>
          <div className="hero-trio-item">
            <div className="hero-trio-num">6wk</div>
            <div className="hero-trio-label">Effect lasted</div>
          </div>
        </div>

        <p className="hero-trio-context">Average results from the 2026 University of Bonn clinical trial, in which participants ate almost exclusively oatmeal for 48 hours. Effects were still recorded six weeks later.</p>

        <button className="hero-cta" onClick={() => scrollTo(plannerRef)}>Start the reset</button>


      <div className="wrap">

        {/* ═══ OATS FOR DINNER ═══ */}
        <div className="sec">
          <div className="sec-label">Oats for dinner?</div>
          <h2 className="sec-title">Yeah - savoury oats are a thing</h2>
          <p className="sec-body">Savoury grain porridges are eaten at every meal across most of the world. Scottish skirlie is oatmeal fried with onions and served alongside meat. South Indian oat pongal is a spiced savoury porridge eaten morning, noon, and night. In China and across East Asia, congee is a staple at all hours. Oats are a neutral grain, like rice or pasta. We just got used to putting sugar on them.</p>
          <p className="sec-body">The recipes here are designed for the reset: maximum flavour, minimal fat, sugar, and cholesterol. They work as everyday meals too. Outside the reset, add feta, olive oil, a poached egg, whatever you like. For the 48 hours, they are kept clean so the oats can do their job.</p>
        </div>

        {/* ═══ PLANNER ═══ */}
        <div className="sec" ref={plannerRef}>
          <div className="sec-label">Meal planner</div>
          <h2 className="sec-title">Pick any 6</h2>
          <p className="planner-meta">25 tasty one pot recipes. Under 10 minutes each. Choose 6 and we'll make your plan with recipes.</p>

          <div className="filters">
            <button className={`fbtn ${tf === "all" ? "on" : ""}`} onClick={() => setTf("all")}>All</button>
            <button className={`fbtn ${tf === "sweet" ? "on" : ""}`} onClick={() => setTf("sweet")}>Sweet</button>
            <button className={`fbtn ${tf === "savoury" ? "on" : ""}`} onClick={() => setTf("savoury")}>Savoury</button>
            <span className="fsep" />
            <button className={`fbtn ${df === "all" ? "on" : ""}`} onClick={() => setDf("all")}>All diets</button>
            <button className={`fbtn ${df === "vegan" ? "on" : ""}`} onClick={() => setDf("vegan")}>Vegan</button>
            <button className={`fbtn ${df === "vegetarian" ? "on" : ""}`} onClick={() => setDf("vegetarian")}>Vegetarian</button>
          </div>
          <div className="counter"><strong>{sel.length}</strong> / 6 selected</div>

          <div className="rgrid">
            {filtered.map((r) => {
              const isSel = sel.includes(r.id);
              const isDis = !isSel && sel.length >= 6;
              const ingredientNames = r.i.map(x => x.n).join(", ");
              return (
                <div key={r.id} className={`rcard ${isSel ? "sel" : ""} ${isDis ? "dis" : ""}`} onClick={() => !isDis && toggle(r.id)}>
                  <div className={`rcard-type ${r.type}`}>{r.type}</div>
                  <div className="rcard-name">{r.name}</div>
                  <div className="rcard-ingredients">{ingredientNames}</div>
                  <div className="rcard-tip">{r.t}</div>
                  <div className="rcard-diet">{dietLabel(r.diet)}</div>
                </div>
              );
            })}
          </div>

          {sel.length > 0 && (
            <div className="sbar">
              <button className="sbar-btn" disabled={sel.length < 6} onClick={() => { setShowPlan(true); scrollTo(planRef); }}>
                {sel.length < 6 ? `Select ${6 - sel.length} more` : "Generate my plan"}
              </button>
            </div>
          )}
        </div>

        {/* ═══ PLAN ═══ */}
        {validPlan && (
          <div className="sec" ref={planRef}>
            <div className="sec-label">Your plan</div>
            <h2 className="sec-title">Your 48-Hour Reset</h2>

            <div className="plan-wrapper">
              {[{ day: 1, label: "Saturday", meals: day1 }, { day: 2, label: "Sunday", meals: day2 }].map(({ day, label, meals }, di) => (
                <div key={day}>
                  {di > 0 && <div className="plan-day-divider" />}
                  <div className="plan-day-header">
                    <span className="plan-day-name">{label}</span>
                    <span className="plan-day-sub">Day {day}</span>
                  </div>
                  {meals.map((s) => (
                    <div key={s.meal.id} className="plan-meal">
                      <div className="plan-slot">{s.slot}</div>
                      <div>
                        <h4>{s.meal.name}</h4>
                        <div className="plan-ratio">Oats {s.meal.r} &middot; {s.meal.w}ml water</div>
                        <div className="plan-ingredients-list">
                          <strong>You'll need:</strong> 100g rolled oats{s.meal.i.length > 0 ? `, ${s.meal.i.map(x => x.n).join(", ")}` : ""}
                        </div>
                        <p>{s.meal.m}</p>
                        <div className="plan-tip">{s.meal.t}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="shop">
              <div className="shop-title">Shopping List</div>
              <div className="shop-subtitle">Everything you need for the 48 hours.</div>
              {CAT_ORDER.map((cat) => {
                const items = shopping[cat];
                if (!items || !items.length) return null;
                return (
                  <div key={cat} className="shop-cat">
                    <div className="shop-cat-label">{CAT_LABELS[cat]}</div>
                    <div className="shop-grid">
                      {items.map((item, idx) => (
                        <div key={idx} className={`shop-item ${cat === "oats" ? "hl" : ""}`}>{item}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button className="reset-btn" onClick={() => { setShowPlan(false); setSel([]); scrollTo(plannerRef); }}>Start over</button>
            </div>
          </div>
        )}

        {/* ═══ SCIENCE ═══ */}
        <div className="sec">
          <div className="sec-label">The science</div>
          <h2 className="sec-title">Why this works</h2>
          <p className="sec-body">The cholesterol-lowering effect of oats is one of the most well-established findings in nutritional science. The US FDA approved a health claim for oat beta-glucan and reduced heart disease risk in 1997. The European Food Safety Authority followed in 2011. Food Standards Australia New Zealand approved a similar claim.</p>
          <div className="ev-row">
            <div><div className="ev-num">58+</div><div className="ev-label">Clinical trials</div></div>
            <div><div className="ev-num">3,974</div><div className="ev-label">Participants</div></div>
            <div><div className="ev-num">3</div><div className="ev-label">Govt. approvals</div></div>
            <div><div className="ev-num">40+</div><div className="ev-label">Years of research</div></div>
          </div>
          <p className="sec-body">Your gut bacteria break down compounds in oats into phenolic metabolites that interfere with cholesterol processing at a cellular level. The 2026 Bonn trial found that a short, high-dose protocol triggers a much stronger microbiome response than moderate daily consumption. Each 100g serving contains roughly 4g of beta-glucan, exceeding the 3g daily threshold used for health claims worldwide. Over the reset, you consume roughly 24g total.</p>
          <p className="sec-body">The 48-hour format is new. The science behind oats and cholesterol is not.</p>
        </div>

        {/* ═══ IN THE PRESS ═══ */}
        <div className="sec">
          <div className="sec-label">In the press</div>
          <div style={{ marginTop: 8 }}>
            {PRESS.map((item, i) => (
              <div key={i} className="press-item">
                <div className="press-item-pub">{item.pub}</div>
                <div className="press-item-title">{item.title}</div>
                <div className="press-item-desc">{item.desc}</div>
                <div className="press-item-footer">
                  <span className="press-item-date">{item.date}</span>
                  <a className="press-item-link" href={item.url} target="_blank" rel="noopener noreferrer">Read article &#8594;</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ FAQ ═══ */}
        <div className="sec">
          <div className="sec-label">FAQ</div>
          <h2 className="sec-title">Questions</h2>
          <div style={{ marginTop: 8 }}>
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {item.q}
                  <span className={`faq-arrow ${faqOpen === i ? "open" : ""}`}>+</span>
                </button>
                {faqOpen === i && <div className="faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ STUDIES ═══ */}
        <div className="sec">
          <div className="sec-label">Further reading</div>
          <h2 className="sec-title">The studies</h2>
          <div style={{ marginTop: 8 }}>
            {STUDIES.map((s, i) => (
              <div key={i} className="study-item">
                <div className="study-head">
                  <span className="study-title">{s.title}</span>
                  <span className="study-year">{s.year}</span>
                </div>
                <div className="study-pub">{s.pub}</div>
                <div className="study-desc">{s.desc}</div>
                <a className="study-link" href={s.url} target="_blank" rel="noopener noreferrer">Read &#8594;</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="footer">
        <p>The 48-Hour Oat Reset is a free resource. No products, no sponsors.</p>
        <p style={{ opacity: 0.5 }}>This is not medical advice. Talk to your doctor before making dietary changes.</p>
      </div>
    </div>
  );
}
