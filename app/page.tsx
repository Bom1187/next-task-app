import AppName from "@/components/AppName";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="w-full">
      {/* แสดงชื่อแอป */}
      <div className="text-center mt-40">
        <AppName />
      </div>
      {/* แสดงรูป logo ของแอป */}
      <Image
        src="https://tuttynrvhcscplukufxt.supabase.co/storage/v1/object/public/table_bk/task_logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mt-10"
      />
      {/* การป้อน Secure Code เพื่อเข้าใช้งาน แอป */}
      <input
        type="text"
        placeholder="Enter Secure Code"
        className="w-100 mt-10 p-2 border border-gray-500 rounded-md flex mx-auto"
      />
      <button className="w-100 mt-5 p-2 border border-gray-500 rounded-md flex mx-auto bg-blue-500 text-white hover:bg-blue-700">
        <span className="mx-auto"> เช้าใช้งาน </span>
      </button>
      {/* แสดง footer */}
      <Footer />
    </div>
  );
}
