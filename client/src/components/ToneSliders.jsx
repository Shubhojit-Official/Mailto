export default function ToneSliders({ values, onChange }) {
  const sliders = [
    {
      key: "personalization",
      label: "Personalization",
    },
    {
      key: "formality",
      label: "Formality",
    },
    {
      key: "persuasiveness",
      label: "Persuasiveness",
    },
  ];

  return (
    <div className="space-y-4">
      {sliders.map(({ key, label }) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-zinc-400">{label}</label>
            <span className="text-xs text-zinc-500">{values[key]}</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={values[key]}
            onChange={(e) =>
              onChange({
                ...values,
                [key]: Number(e.target.value),
              })
            }
            className="w-full accent-white hover:cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}
