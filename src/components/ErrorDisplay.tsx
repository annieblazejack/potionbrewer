interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <section className="border border-red-400 bg-red-50 p-8 mb-12">
      <h3 className="font-serif text-xl font-semibold text-red-800 mb-3">
        Brewing Failed
      </h3>
      <p className="text-red-700">{error}</p>
    </section>
  );
}