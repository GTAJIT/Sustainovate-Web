
export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-lg font-bold">My App</h1>
        <ul className="flex space-x-4">
          <li><a href="/">Home</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </div>
    </nav>
  );
}
