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

function checkBrokenImports(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split("\n");

    let hasIssues = false;
    let inImportBlock = false;
    let importStartLine = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for import statement start
      if (line.startsWith("import ")) {
        inImportBlock = true;
        importStartLine = i;
      }

      // Check for dynamic export inside import block
      if (inImportBlock && line.includes("export const dynamic")) {
        console.log(
          `❌ Broken import detected in ${filePath} at line ${i + 1}`,
        );
        console.log(`   Import block starts at line ${importStartLine + 1}`);
        hasIssues = true;
      }

      // Check for import block end (semicolon or closing brace)
      if (inImportBlock && (line.endsWith(";") || line.includes("} from"))) {
        inImportBlock = false;
      }
    }

    if (!hasIssues) {
      console.log(`✅ No broken imports: ${filePath}`);
    }

    return !hasIssues;
  } catch (error) {
    console.error(`❌ Error checking ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🔍 Checking for broken import statements...\n");

  let successCount = 0;
  let totalCount = routesToCheck.length;

  routesToCheck.forEach((route) => {
    if (checkBrokenImports(route)) {
      successCount++;
    }
  });

  console.log(`\n🎉 Completed! Checked ${successCount}/${totalCount} routes.`);

  if (successCount < totalCount) {
    console.log(
      "\n⚠️  Some files have broken imports that need manual fixing.",
    );
  }
}

main();
