import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <Image
        src="/images/logo/Logo_PLN.webp"
        fill
        sizes="200px"
        alt="logo PLN"
        role="presentation"
        quality={100}
      />
    </div>
  );
}