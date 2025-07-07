const fs = require("fs");
const path = require("path");

// List of API routes that use getServerSession and need dynamic configuration
const routesToFix = [
  "app/api/notifications/mark-read/route.js",
  "app/api/notifications/route.js",
  "app/api/stripe/create-portal/route.js",
  "app/api/admin/check-users/route.js",
  "app/api/admin/milestones/route.js",
  "app/api/admin/milestones/[id]/route.js",
  "app/api/admin/email-stats/route.js",
  "app/api/email-preferences/route.js",
  "app/api/stripe/create-checkout/route.js",
  "app/api/products/categories/route.js",
  "app/api/admin/create-projects/route.js",
  "app/api/products/[id]/route.js",
  "app/api/products/suppliers/route.js",
  "app/api/products/route.js",
  "app/api/test-notifications/route.js",
  "app/api/moodboards/route.js",
  "app/api/moodboards/[id]/sections/[sectionId]/products/[productId]/route.js",
  "app/api/moodboards/[id]/route.js",
  "app/api/moodboards/[id]/sections/[sectionId]/route.js",
  "app/api/moodboards/[id]/sections/route.js",
  "app/api/moodboards/[id]/sections/[sectionId]/products/[productId]/approval/route.js",
  "app/api/moodboards/[id]/sections/[sectionId]/products/route.js",
];

function addDynamicConfig(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    // Check if dynamic config already exists
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`✅ Already configured: ${filePath}`);
      return true;
    }

    // Find the first import statement and add dynamic config after it
    const lines = content.split("\n");
    let insertIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("import ")) {
        insertIndex = i;
      } else if (insertIndex !== -1 && lines[i].trim() === "") {
        // Found the end of import statements
        break;
      }
    }

    if (insertIndex === -1) {
      console.log(`⚠️  No import statements found in: ${filePath}`);
      return false;
    }

    // Insert dynamic config after the last import
    lines.splice(
      insertIndex + 1,
      0,
      "",
      "// Force dynamic rendering for this route",
      "export const dynamic = 'force-dynamic';",
      "",
    );

    const newContent = lines.join("\n");
    fs.writeFileSync(fullPath, newContent);

    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🔧 Adding dynamic configuration to API routes...\n");

  let successCount = 0;
  let totalCount = routesToFix.length;

  routesToFix.forEach((route) => {
    if (addDynamicConfig(route)) {
      successCount++;
    }
  });

  console.log(`\n🎉 Completed! Fixed ${successCount}/${totalCount} routes.`);
}

main();
