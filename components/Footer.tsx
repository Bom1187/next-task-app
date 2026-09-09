import Image from "next/image";
import Dev from "@/assets/images/dev.png";

export default function Footer() {
  return (
    <div>
      <hr className="mt-10 w-100 mx-auto mb-5"/>
      <p className="text-center text-gray-500">
        Copyright &copy; 2026 by Bombay SAU
        <br />
        <Image
        src={Dev}
        alt="Dev"
        width={50}
        height={50}
        className="mx-auto mt-5"    
        />
      </p>
    </div>
  );
}
