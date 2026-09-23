// Usage: npm run seed
// Idempotent: backfills slug/status on older documents, then inserts curated tools
// that don't exist yet (matched by slug). Never overwrites or deletes data.
import AITool from "../models/AITool.js";
import seedTools from "../data/seedTools.js";
import { connectDB, disconnectDB } from "../lib/db.js";
import { slugify } from "../lib/slug.js";

async function main() {
  await connectDB();

  // Backfill first so an existing "ChatGPT" claims slug "chatgpt" and isn't duplicated below.
  const legacy = await AITool.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] });
  for (const doc of legacy) {
    const base = slugify(doc.name) || "tool";
    let slug = base;
    for (let i = 2; await AITool.exists({ slug, _id: { $ne: doc._id } }); i++) slug = `${base}-${i}`;
    doc.slug = slug;
    await doc.save({ validateBeforeSave: false });
  }
  const statusFix = await AITool.updateMany({ status: { $exists: false } }, { $set: { status: "approved" } });

  let inserted = 0;
  for (const tool of seedTools) {
    const res = await AITool.updateOne(
      { slug: tool.slug },
      { $setOnInsert: { ...tool, status: "approved", upvotes: 0, visits: 0 } },
      { upsert: true }
    );
    inserted += res.upsertedCount;
  }

  console.log(
    `Seed complete: ${inserted} tools inserted, ${legacy.length} slugs and ${statusFix.modifiedCount} statuses backfilled.`
  );
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB().catch(() => {}));
