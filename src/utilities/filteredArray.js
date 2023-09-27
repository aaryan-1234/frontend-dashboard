export function mergeApplicationsByTenantAndEmail(inputArray) {
    const mergedArray = [];
  
    // Create an object to store objects grouped by tenant_id and email
    const groupedObjects = {};
  
    // Iterate through the input array
    inputArray.forEach((obj) => {
      const { tenant_id, email, applications } = obj;
      const key = `${tenant_id}_${email}`;
  
      if (!groupedObjects[key]) {
        // If the key doesn't exist, create a new entry with applications as an array
        groupedObjects[key] = { tenant_id, email, applications: [applications] };
      } else {
        // If the key exists, push the applications into the array
        groupedObjects[key].applications.push(applications);
      }
    });
  
    // Convert the grouped objects back into an array
    for (const key in groupedObjects) {
      mergedArray.push(groupedObjects[key]);
    }
  
    return mergedArray;
  }