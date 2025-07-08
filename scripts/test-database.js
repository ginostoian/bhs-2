// Test script to see what's actually in the database
// Run this in the browser console

async function testDatabase() {
  try {
    console.log("Testing database content...");

    // Get all employees
    const response = await fetch("/api/employees");
    const data = await response.json();

    if (!data.employees) {
      console.error("No employees found");
      return;
    }

    console.log(`Found ${data.employees.length} employees`);

    for (const employee of data.employees) {
      console.log(`\nEmployee: ${employee.name}`);
      console.log(`  ID: ${employee.id}`);
      console.log(`  dayRate: ${employee.dayRate}`);
      console.log(`  hourlyRate: ${employee.hourlyRate}`);

      // Get raw data
      const rawResponse = await fetch(`/api/employees/${employee.id}`);
      const rawData = await rawResponse.json();
      const rawEmployee = rawData.employee;

      console.log(`  Raw dayRate: ${rawEmployee.dayRate}`);
      console.log(`  Raw hourlyRate: ${rawEmployee.hourlyRate}`);
      console.log(`  Raw employee object:`, rawEmployee);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testDatabase();
