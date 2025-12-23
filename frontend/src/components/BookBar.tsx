interface Props {
  selected: string[];
  onBook: () => void;
}

export default function BookBar({ selected, onBook }: Props) {
  const isContinuous = () => {
    const nums = selected.map((id) => Number(id.slice(1))).sort((a, b) => a - b);
    return nums.every((v, i, a) => i === 0 || v === a[i - 1] + 1);
  };

  return (
    <button
      disabled={!isContinuous() || selected.length === 0}
      onClick={onBook}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
    >
      Book Selected Seats
    </button>
  );
}
