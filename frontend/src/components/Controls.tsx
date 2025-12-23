interface Props {
  onGenerate: (rows: number, cols: number) => void;
}

export default function Controls({ onGenerate }: Props) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => onGenerate(5, 5)}
      >
        Generate 5x5
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => onGenerate(8, 10)}
      >
        Generate 8x10
      </button>
    </div>
  );
}
 