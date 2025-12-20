export default function AchievementDetails({ item }) {
  if (!item) return null;

  return (
    <div className="max-w-md rounded-xl bg-[#243A57] p-6 border border-[#50C8DC] animate-slide">
      <h3 className="text-xl font-semibold">{item.title}</h3>
      <p className="text-sm text-[#50C8DC] mt-1">{item.date}</p>

      <hr className="my-4 border-gray-600" />

      <h4 className="font-semibold mb-2">Details</h4>
      <p className="text-gray-300 text-sm">{item.details}</p>
    </div>
  );
}
