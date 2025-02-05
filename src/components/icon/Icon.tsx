import { colorMap } from "./iconColor";
import { iconData } from "./iconData";

type IconProps = {
  name: keyof typeof iconData;
  size?: number;
  color?: keyof typeof colorMap | string;
} & React.SVGProps<SVGSVGElement>;

export function Icon({ name, size = 24, color, ...props }: IconProps) {
  const icon = iconData[name];
  if (!icon) {
    console.warn(`${name}은(는) 없는 아이콘입니다.`);
    return null;
  }

  const targetColor = color ? colorMap[color as keyof typeof colorMap] || color : "currentColor";
  console.log(targetColor);
  return (
    <svg
      width={size}
      height={size}
      fill={targetColor}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {icon}
    </svg>
  );
}
