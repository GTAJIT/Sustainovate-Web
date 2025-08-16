// Fake in-memory data store
let users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

/**
 * Get all users
 */
export async function getAll() {
  return users;
}

/**
 * Get a user by ID
 */
export async function getById(id: string) {
  return users.find((u) => u.id === id);
}

/**
 * Create a new user
 */
export async function create(data: { name: string; email: string }) {
  const newUser = {
    id: (users.length + 1).toString(),
    ...data,
  };
  users.push(newUser);
  return newUser;
}

/**
 * Update a user
 */
export async function update(id: string, data: Partial<{ name: string; email: string }>) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...data };
  return users[index];
}

/**
 * Delete a user
 */
export async function remove(id: string) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const deleted = users[index];
  users = users.filter((u) => u.id !== id);
  return deleted;
}
