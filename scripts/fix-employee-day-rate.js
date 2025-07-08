// Script to fix employee day rate in database
// Run this in the browser console on the admin employees page

async function fixEmployeeDayRate() {
  try {
    console.log("Starting database fix for employee day rates...");

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

      // Check if employee has hourlyRate in the raw data
      const rawResponse = await fetch(`/api/employees/${employee.id}`);
      const rawData = await rawResponse.json();
      const rawEmployee = rawData.employee;

      console.log(`  - Raw employee data:`, rawEmployee);

      // Check if we need to convert hourlyRate to dayRate
      if (
        rawEmployee.hourlyRate !== undefined &&
        rawEmployee.hourlyRate !== null
      ) {
        console.log(`  - Found hourlyRate: £${rawEmployee.hourlyRate}/hr`);
        console.log(
          `  - Current dayRate: £${rawEmployee.dayRate || "Not set"}/day`,
        );

        // Convert hourlyRate to dayRate (multiply by 8)
        const dayRate = rawEmployee.hourlyRate * 8;
        console.log(`  - Converting to dayRate: £${dayRate}/day`);

        // Update the employee with the new dayRate
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
      } else if (
        rawEmployee.dayRate !== undefined &&
        rawEmployee.dayRate !== null
      ) {
        console.log(`  - ✅ Already has dayRate: £${rawEmployee.dayRate}/day`);
        skippedCount++;
      } else {
        console.log(`  - ⏭️ No rate information found`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Database fix completed!`);
    console.log(`Updated: ${updatedCount} employees`);
    console.log(`Skipped: ${skippedCount} employees`);
    console.log(`\nYou can now refresh the page to see the updated day rates.`);
  } catch (error) {
    console.error("❌ Database fix failed:", error);
  }
}

// Instructions
console.log("To fix the database, type: fixEmployeeDayRate()");
console.log(
  "This will convert any remaining hourlyRate values to dayRate values in the database.",
);
