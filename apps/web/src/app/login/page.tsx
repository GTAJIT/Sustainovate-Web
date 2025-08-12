export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="border border-amber-400 rounded-2xl p-8 bg-gray-800 max-w-sm w-full flex flex-col gap-5 shadow-lg">
        <h2 className="text-2xl font-bold text-amber-400 text-center">Login</h2>
        
        <input
          type="text"
          placeholder="Email"
          className="border border-gray-600 rounded-md p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-600 rounded-md p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        
        <button className="bg-amber-400 text-gray-900 rounded-md p-3 font-semibold hover:bg-amber-300 transition-colors">
          Submit
        </button>

        {/* Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-3 text-gray-400">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Social login buttons */}
        <button className="bg-[#5865F2] text-white rounded-md p-3 font-semibold hover:bg-[#4752C4] transition-colors">
          Login with Discord
        </button>
        <button className="bg-white text-gray-900 rounded-md p-3 font-semibold border hover:bg-gray-100 transition-colors">
          Login with Google
        </button>
        <button className="bg-gray-900 text-white rounded-md p-3 font-semibold border border-gray-600 hover:bg-gray-700 transition-colors">
          Login with GitHub
        </button>
      </div>
    </div>
  );
}
