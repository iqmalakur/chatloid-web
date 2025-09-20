import { ReactNode } from "react";

type MenuButtonProps = {
  active: boolean;
  onClick: () => void;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  label: string;
};

export default function MenuButton({
  active,
  onClick,
  activeIcon,
  inactiveIcon,
  label,
}: MenuButtonProps) {
  return (
    <button
      className={`ml-0.5 flex cursor-pointer items-center gap-3.5 rounded-md p-2 hover:bg-gray-100 ${
        active ? "font-semibold" : ""
      }`}
      onClick={onClick}
    >
      {active ? activeIcon : inactiveIcon}
      <span className="inline">{label}</span>
    </button>
  );
}
