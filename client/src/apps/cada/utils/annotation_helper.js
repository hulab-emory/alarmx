exports.filterMostRecentByField = (objects) => {
  // Sort the objects by the `createdAt` property in descending order
  const sortedObjects = objects.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Create a new map to track the most recent entry for each unique `field`
  const mostRecentEntries = new Map();

  // Iterate over the sorted array
  for (const obj of sortedObjects) {
    // If the `field` has not been added to the map, add it
    if (!mostRecentEntries.has(obj.field)) {
      mostRecentEntries.set(obj.field, obj);
    }
    // If the `field` is already in the map, we skip it because we already have the most recent entry
  }

  // Convert the map values to an array and return
  return Array.from(mostRecentEntries.values());
};
