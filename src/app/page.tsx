import Image from "next/image";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <Image
        src={"https://4kwallpapers.com/images/walls/thumbs_3t/10025.jpg"}
        alt="woman picture"
        width={500}
        height={500}
      />
    </div>
  );
}
