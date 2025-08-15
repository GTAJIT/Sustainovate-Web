import { connectDB } from '@sustainovate/shared/config';
import { User } from '@sustainovate/shared/schemas';

export async function createUser(username: string, email: string, password: string) {
  try {
    // Ensure database is connected
    await connectDB();

    // Check if the email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return { success: false, message: 'Email already registered' };
    }

    // Create the user
    const newUser = await User.create({
      username,
      email,
      password, // ❗ In production, hash this before saving
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return { success: false, message: 'Failed to create user' };
  }
}
