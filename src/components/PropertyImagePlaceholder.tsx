type PropertyImagePlaceholderProps = {
  className?: string;
  label?: string;
};

export default function PropertyImagePlaceholder({
  className = "",
  label = "Portföy görseli",
}: PropertyImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`bg-[#E7E4DD] ${className}`}
    />
  );
}
