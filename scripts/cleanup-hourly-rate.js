// Script to clean up old hourlyRate fields from employees
// Run this in the browser console on the admin employees page

async function cleanupHourlyRate() {
  try {
    console.log("Starting cleanup of hourlyRate fields...");

    // Get all employees
    const response = await fetch("/api/employees");
    const data = await response.json();

    if (!data.employees) {
      console.error("No employees found");
      return;
    }

    console.log(`Found ${data.employees.length} employees`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const employee of data.employees) {
      console.log(`\nProcessing employee: ${employee.name}`);

      // Check if employee has hourlyRate field (this will only show if the API hasn't cleaned it yet)
      if (employee.hourlyRate !== undefined && employee.hourlyRate !== null) {
        console.log(`  - Found hourlyRate: £${employee.hourlyRate}/hr`);
        console.log(
          `  - Current dayRate: £${employee.dayRate || "Not set"}/day`,
        );

        // If no dayRate is set, convert hourlyRate to dayRate
        if (!employee.dayRate) {
          const dayRate = employee.hourlyRate * 8;
          console.log(`  - Converting to dayRate: £${dayRate}/day`);

          // Update the employee
          const updateResponse = await fetch(`/api/employees/${employee.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dayRate: dayRate,
            }),
          });

          if (updateResponse.ok) {
            console.log(`  - ✅ Updated successfully`);
            updatedCount++;
          } else {
            console.error(
              `  - ❌ Failed to update:`,
              await updateResponse.text(),
            );
          }
        } else {
          console.log(`  - ⏭️ Day rate already exists, skipping conversion`);
          skippedCount++;
        }
      } else {
        console.log(`  - ✅ No hourlyRate found (already cleaned up)`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Cleanup completed!`);
    console.log(`Updated: ${updatedCount} employees`);
    console.log(`Skipped: ${skippedCount} employees`);
    console.log(`\nYou can now refresh the page to see the updated day rates.`);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

// Instructions
console.log("To run the cleanup, type: cleanupHourlyRate()");
console.log(
  "This will convert any remaining hourlyRate values to dayRate values.",
);
