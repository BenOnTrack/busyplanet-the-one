// DexieIDDatabase.ts
import Dexie from 'dexie';

// Create a Dexie instance and define the database
export const bookmarkdb = new Dexie<IDDBSchema>('bookmarks');

// Define the database version and stores
bookmarkdb.version(1).stores({
  ids: '&id, name, class, subclass, category,description'
});

interface IDDBSchema {
  ids: { id: number, name: string, class: string, subclass: string, category: string, description:string}; // Include the 'name' property
}

bookmarkdb.open();

// Export additional types/interfaces as needed
export interface IDData {
  id: number;
  name: string;
  class: string; 
  subclass: string; 
  category: string;
  description:string;
}

// Function to add a bookmark to the database
// Assuming you want to use the `async function` declaration
export async function addBookmark(
  id: number,
  name: string,
  classValue: string,
  subclass: string,
  category: string,
  description:string
): Promise<void> {
  try {
    await bookmarkdb.ids.put({ id, name, class: classValue, subclass, category,description });
    console.log(`ID ${id} added to the database.`);
  } catch (error) {
    console.error('Error adding ID to the database: ', error);
  }
}


// Function to retrieve all IDs from the database
export async function getAllBookmarks(): Promise<IDData[]>{
  try {
    const allIDs = await bookmarkdb.ids.toArray();
    return allIDs;
  } catch (error) {
    console.error('Error retrieving IDs from the database: ', error);
    return [];
  }
};

// Function to remove an ID from the database
export async function removeBookmark(id: number): Promise<void> {
  try {
    await bookmarkdb.ids.delete(id);
    console.log(`ID ${id} removed from the database.`);
  } catch (error) {
    console.error('Error removing ID from the database: ', error);
  }
};

