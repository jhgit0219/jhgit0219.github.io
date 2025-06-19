export default function MobileNavbar({
  onProjectsClick,
  onContactClick,
}: {
  onProjectsClick: () => void;
  onContactClick: () => void;
}) {
  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-[#0a0a0a] border-b border-red-500/20 px-4 py-2 flex items-center justify-between text-sm text-red-300">
      {/* Left side logo */}
      <div className="text-xl font-bold text-white">J</div>

      {/* Right side nav links */}
      <div className="flex space-x-4">
        <button onClick={onProjectsClick} className="hover:text-white">
          Projects
        </button>
        <button onClick={onContactClick} className="hover:text-white">
          Contact
        </button>
      </div>
    </div>
  );
}
