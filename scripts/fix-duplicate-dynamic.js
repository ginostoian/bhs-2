const fs = require("fs");
const path = require("path");

// List of API routes that were modified
const routesToCheck = [
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

function fixDuplicateDynamic(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    // Count occurrences of dynamic export
    const dynamicMatches = content.match(
      /export const dynamic = ['"]force-dynamic['"];?/g,
    );

    if (!dynamicMatches) {
      console.log(`✅ No dynamic exports found: ${filePath}`);
      return true;
    }

    if (dynamicMatches.length === 1) {
      console.log(`✅ Single dynamic export (correct): ${filePath}`);
      return true;
    }

    if (dynamicMatches.length > 1) {
      console.log(`🔧 Fixing duplicate dynamic exports: ${filePath}`);

      // Remove all dynamic exports and add one clean one
      let newContent = content.replace(
        /export const dynamic = ['"]force-dynamic['"];?\s*/g,
        "",
      );

      // Find the last import statement
      const lines = newContent.split("\n");
      let insertIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith("import ")) {
          insertIndex = i;
        } else if (insertIndex !== -1 && lines[i].trim() === "") {
          // Found the end of import statements
          break;
        }
      }

      if (insertIndex !== -1) {
        // Insert single dynamic export after imports
        lines.splice(
          insertIndex + 1,
          0,
          "",
          "// Force dynamic rendering for this route",
          "export const dynamic = 'force-dynamic';",
          "",
        );
        newContent = lines.join("\n");
      }

      fs.writeFileSync(fullPath, newContent);
      console.log(`✅ Fixed duplicate dynamic exports: ${filePath}`);
      return true;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🔧 Checking for duplicate dynamic exports...\n");

  let successCount = 0;
  let totalCount = routesToCheck.length;

  routesToCheck.forEach((route) => {
    if (fixDuplicateDynamic(route)) {
      successCount++;
    }
  });

  console.log(`\n🎉 Completed! Checked ${successCount}/${totalCount} routes.`);
}

main();
