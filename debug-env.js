// Debug script to check environment variables
console.log("🔍 Checking environment variables...\n");

const requiredVars = [
  "GOOGLE_ID",
  "GOOGLE_SECRET",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "MONGODB_URI",
];

console.log("Required environment variables:");
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const maskedValue =
      varName.includes("SECRET") || varName.includes("SECRET")
        ? value.substring(0, 8) + "..."
        : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log(
  "\n🔗 Current NEXTAUTH_URL:",
  process.env.NEXTAUTH_URL || "NOT SET",
);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV || "NOT SET");

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  console.log("\n🚨 CRITICAL: Google OAuth credentials are missing!");
  console.log(
    "💡 Please set GOOGLE_ID and GOOGLE_SECRET in your environment variables.",
  );
}
