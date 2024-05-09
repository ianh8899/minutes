import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome to Minutes Prototype</h1>
        <p className="text-lg mb-8 text-center px-4">
          Your personal space to collaborate with your organization and keep track of your meeting minutes.
        </p>
        <div className="bg-gray-700 p-4 rounded shadow-lg max-w-md w-full">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
