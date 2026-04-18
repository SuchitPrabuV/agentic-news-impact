export default function ErrorState({ message }) {
  return (
    <div className="bg-red-950/40 border border-red-800 rounded-2xl p-5 text-red-200">
      <h3 className="font-semibold mb-2">
        Something went wrong
      </h3>

      <p className="text-sm text-red-300">
        {message}
      </p>
    </div>
  );
}