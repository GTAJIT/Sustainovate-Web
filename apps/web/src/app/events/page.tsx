"use client"
import { useState } from "react";

type Event = {
  id: string;
  name: string;
  date: string; // ISO string or formatted
  interestedCount: number;
};

const initialEvents: Event[] = [
  { id: "1", name: "Green Tech Conference", date: "2025-09-01", interestedCount: 120 },
  { id: "2", name: "Sustainability Hackathon", date: "2025-08-25", interestedCount: 85 },
  { id: "3", name: "Eco Startup Meetup", date: "2025-09-10", interestedCount: 95 },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(() =>
    [...initialEvents].sort((a, b) => b.interestedCount - a.interestedCount)
  );

  const handleRegister = (id: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, interestedCount: e.interestedCount + 1 } : e
      );
      return updated.sort((a, b) => b.interestedCount - a.interestedCount);
    });
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Recent Events</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="flex items-center justify-between bg-gray-800 p-5 rounded-lg shadow-md"
          >
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 font-bold text-xl">{index + 1}.</span>
                <h2 className="text-2xl font-semibold">{event.name}</h2>
              </div>
              <p className="text-gray-400">Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="mt-1 text-green-400 font-medium">
                {event.interestedCount} peoples intrested
              </p>
            </div>
            <button
              onClick={() => handleRegister(event.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-md transition"
            >
              Register
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
