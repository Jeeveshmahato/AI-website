// Usage:
//   npm run seed                 # safe: insert missing catalog tools, fill blank fields
//   npm run seed -- --overwrite  # also reset curated fields (pricing, description, tags...)
//                                # of catalog tools to the values in data/seedTools.js
//
// Idempotent. Never deletes data and never touches upvotes, visits, status or featured
// flags of existing tools.
import AITool from "../models/AITool.js";
import seedTools from "../data/seedTools.js";
import { connectDB, disconnectDB } from "../lib/db.js";
import { slugify } from "../lib/slug.js";

const OVERWRITE = process.argv.includes("--overwrite");
const CURATED_FIELDS = ["category", "price", "link", "description", "tagline", "tags"];

async function main() {
  await connectDB();

  // 1. Backfill slugs first, so an existing "ChatGPT" claims "chatgpt" and isn't duplicated.
  const legacy = await AITool.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] });
  for (const doc of legacy) {
    const base = slugify(doc.name) || "tool";
    let slug = base;
    for (let i = 2; await AITool.exists({ slug, _id: { $ne: doc._id } }); i++) slug = `${base}-${i}`;
    doc.slug = slug;
    await doc.save({ validateBeforeSave: false });
  }
  const statusFix = await AITool.updateMany({ status: { $exists: false } }, { $set: { status: "approved" } });

  // 2. Placeholder images from the old site point at a dead service; clear them so the
  //    frontend uses each tool's real site icon instead.
  const placeholders = await AITool.updateMany({ image: /placeholder\.com/i }, { $set: { image: "" } });

  let inserted = 0;
  let filled = 0;
  let overwritten = 0;
  for (const tool of seedTools) {
    // 3. Insert catalog tools that don't exist yet.
    const res = await AITool.updateOne(
      { slug: tool.slug },
      { $setOnInsert: { ...tool, status: "approved", upvotes: 0, visits: 0 } },
      { upsert: true }
    );
    inserted += res.upsertedCount;
    if (res.upsertedCount) continue;

    if (OVERWRITE) {
      const set = Object.fromEntries(CURATED_FIELDS.map((f) => [f, tool[f]]));
      overwritten += (await AITool.updateOne({ slug: tool.slug }, { $set: set })).matchedCount;
      continue;
    }

    // 4. Fill blank fields on existing records without overriding anything an admin set.
    const tagline = await AITool.updateOne(
      { slug: tool.slug, $or: [{ tagline: { $exists: false } }, { tagline: "" }, { tagline: null }] },
      { $set: { tagline: tool.tagline } }
    );
    const tags = await AITool.updateOne(
      { slug: tool.slug, $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }] },
      { $set: { tags: tool.tags } }
    );
    filled += tagline.modifiedCount + tags.modifiedCount;
  }

  console.log(
    [
      `Seed complete${OVERWRITE ? " (--overwrite)" : ""}:`,
      `${inserted} tools inserted`,
      OVERWRITE ? `${overwritten} catalog tools synced to data/seedTools.js` : `${filled} blank fields filled`,
      `${legacy.length} slugs, ${statusFix.modifiedCount} statuses backfilled`,
      `${placeholders.modifiedCount} placeholder images cleared`,
    ].join("\n  ")
  );
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB().catch(() => {}));
