// Static recipe pages. Used only by scripts/prerender.mjs at build time.
// These pages ship as plain HTML with no React on the client.
import { RECIPES, isStudied, puristNote, dietLabel, recipeSlug } from "./App";

export const SITE = "https://www.oatreset.com";

const FONTS = "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,700;8..60,800&family=Outfit:wght@400;500;600;700&display=swap";

const CSS = `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Source Serif 4', Georgia, serif; background: #FAFAF7; color: #1A1A1A; }
a { color: inherit; }
.wrap { max-width: 700px; margin: 0 auto; padding: 48px 24px 64px; }
.brand { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #D4A017; text-decoration: none; }
.crumbs { font-family: 'Outfit', sans-serif; font-size: 12px; color: #aaa; margin: 28px 0 12px; }
.crumbs a { color: #999; }
.type { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #C49A2A; margin-bottom: 10px; }
.type.savoury { color: #6B8F6B; }
h1 { font-size: clamp(32px, 6vw, 46px); font-weight: 800; line-height: 1.08; letter-spacing: -1px; margin-bottom: 16px; }
.meta { font-family: 'Outfit', sans-serif; font-size: 13px; color: #888; margin-bottom: 28px; }
.badge { display: inline-block; margin-left: 8px; padding: 2px 8px; border: 1px solid #E0DBD1; border-radius: 10px; color: #aaa; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
.badge.studied { border-color: #D4A017; color: #B8890F; }
h2 { font-size: 20px; font-weight: 700; margin: 32px 0 12px; }
ul { font-family: 'Outfit', sans-serif; font-size: 15px; line-height: 1.9; color: #444; padding-left: 20px; }
p { font-family: 'Outfit', sans-serif; font-size: 15px; line-height: 1.8; color: #555; }
.tip { font-style: italic; color: #888; margin-top: 12px; }
.purist { color: #B8890F; font-size: 13px; margin-top: 8px; }
.cta { display: inline-block; margin-top: 36px; background: #1A1A1A; color: #FAFAF7; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; padding: 14px 32px; text-decoration: none; }
.note { font-size: 13px; color: #999; margin-top: 28px; }
.list { list-style: none; padding: 0; }
.list li { border-bottom: 1px solid #EEE9E0; padding: 12px 0; line-height: 1.4; }
.list a { text-decoration: none; font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 17px; color: #1A1A1A; }
.list a:hover { text-decoration: underline; }
.list span { font-family: 'Outfit', sans-serif; font-size: 12px; color: #aaa; margin-left: 8px; }
.footer { font-family: 'Outfit', sans-serif; font-size: 12px; color: #bbb; margin-top: 56px; border-top: 1px solid #E8E3DA; padding-top: 24px; line-height: 1.7; }
`;

const DIET_SCHEMA = { vegan: ["https://schema.org/VeganDiet", "https://schema.org/VegetarianDiet"], vegetarian: ["https://schema.org/VegetarianDiet"] };

function Shell({ title, description, path, jsonLd, children }) {
  const url = SITE + path;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta name="theme-color" content="#D4A017" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="48-Hour Oat Reset" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${SITE}/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {jsonLd.map((j, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j).replace(/</g, "\\u003c") }} />
        ))}
        <script defer src="/_vercel/insights/script.js" />
      </head>
      <body>
        <div className="wrap">
          <a className="brand" href="/">48HR Oat Reset</a>
          {children}
          <div className="footer">
            The 48-Hour Oat Reset is a free resource. No products, no sponsors.<br />
            This is not medical advice. Talk to your doctor before making dietary changes.
          </div>
        </div>
      </body>
    </html>
  );
}

const ingredientLines = (r) => [`100g rolled oats`, `${r.w}ml water`, ...r.i.map((x) => x.n)];

export function RecipePage({ r }) {
  const slug = recipeSlug(r);
  const path = `/recipes/${slug}/`;
  const studied = isStudied(r);
  const purist = puristNote(r);
  const title = `${r.name} | ${r.type === "savoury" ? "Savoury" : "Sweet"} oat recipe | 48-Hour Oat Reset`;
  const description = `${r.name}: a ${r.type} oat recipe for the 48-Hour Oat Reset. ${r.t}`.slice(0, 158);
  const others = RECIPES.filter((x) => x.type === r.type && x.id !== r.id).slice(0, 5);

  const recipeLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.name,
    description: r.t,
    recipeCategory: r.type === "savoury" ? "Savoury oats" : "Porridge",
    keywords: `oat reset, 48 hour oat diet, ${r.type} oats, oatmeal`,
    recipeYield: "1 serving",
    recipeIngredient: ingredientLines(r),
    recipeInstructions: [{ "@type": "HowToStep", text: r.m }],
    ...(DIET_SCHEMA[r.diet] ? { suitableForDiet: DIET_SCHEMA[r.diet] } : {}),
    url: SITE + path,
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "48-Hour Oat Reset", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Recipes", item: SITE + "/recipes/" },
      { "@type": "ListItem", position: 3, name: r.name, item: SITE + path },
    ],
  };

  return (
    <Shell title={title} description={description} path={path} jsonLd={[recipeLd, crumbLd]}>
      <div className="crumbs"><a href="/">Home</a> / <a href="/recipes/">Recipes</a></div>
      <div className={`type ${r.type}`}>{r.type}</div>
      <h1>{r.name}</h1>
      <div className="meta">
        {dietLabel(r.diet)} &middot; Oats {r.r} &middot; 1 serving
        <span className={`badge ${studied ? "studied" : ""}`}>{studied ? "As studied" : "Adapted"}</span>
      </div>

      <h2>Ingredients</h2>
      <ul>{ingredientLines(r).map((x) => <li key={x}>{x}</li>)}</ul>

      <h2>Method</h2>
      <p>{r.m}</p>
      <p className="tip">{r.t}</p>
      {purist && <p className="purist">{purist}</p>}

      <p className="note">
        {studied
          ? "This recipe matches the 2026 University of Bonn trial: oats cooked in water with a little fruit or veg, and nothing else."
          : "The 2026 University of Bonn trial used oats cooked in water with a little fruit or veg, and nothing else. This recipe adds a small amount of seasoning to make two days bearable. We think that is a fair trade, but it has not been tested."}
      </p>

      <a className="cta" href="/#planner">Build your 48-hour plan</a>

      <h2>More {r.type} recipes</h2>
      <ul className="list">
        {others.map((o) => (
          <li key={o.id}><a href={`/recipes/${recipeSlug(o)}/`}>{o.name}</a><span>{dietLabel(o.diet)}</span></li>
        ))}
      </ul>
    </Shell>
  );
}

export function RecipeIndex() {
  const path = "/recipes/";
  const groups = [["savoury", "Savoury oat recipes"], ["sweet", "Sweet porridge recipes"]];
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: RECIPES.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/recipes/${recipeSlug(r)}/`, name: r.name })),
  };
  return (
    <Shell
      title="25 oat recipes for the 48-Hour Oat Reset | Savoury and sweet"
      description="Savoury and sweet oat recipes for the 48-Hour Oat Reset: mushroom risotto oats, miso and tomato, congee, chocolate porridge and more. Low fat, low sugar, one pot."
      path={path}
      jsonLd={[listLd]}
    >
      <div className="crumbs"><a href="/">Home</a> / Recipes</div>
      <h1>Oat recipes that don't taste like punishment</h1>
      <p>Fifteen savoury and ten sweet one-pot oat recipes, built for the 48-Hour Oat Reset. Each uses 100g of rolled oats and very little else. Pick any six and the planner turns them into a two-day plan with a shopping list.</p>
      {groups.map(([type, label]) => (
        <div key={type}>
          <h2>{label}</h2>
          <ul className="list">
            {RECIPES.filter((r) => r.type === type).map((r) => (
              <li key={r.id}><a href={`/recipes/${recipeSlug(r)}/`}>{r.name}</a><span>{dietLabel(r.diet)}{isStudied(r) ? " \u00b7 As studied" : ""}</span></li>
            ))}
          </ul>
        </div>
      ))}
      <a className="cta" href="/#planner">Build your 48-hour plan</a>
    </Shell>
  );
}

export function NotFound() {
  return (
    <Shell title="Page not found | 48-Hour Oat Reset" description="This page does not exist." path="/404" jsonLd={[]}>
      <h1 style={{ marginTop: 40 }}>Nothing here but crumbs.</h1>
      <p>This page has been reset harder than your cholesterol. The recipes are still where you left them.</p>
      <a className="cta" href="/">Back to the reset</a>
    </Shell>
  );
}
