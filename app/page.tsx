"use client";

import AppName from "@/components/AppName";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useState } from "react";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";

export default function Page() {
// สร้าง router สำหรับการเปลี่ยนหน้า
  const router = useRouter();
// สร้าง state สำหรับเก็บค่า Secure Code
  const [secureCode, setSecureCode] = useState("");

// สร้าง function สำหรับเซ็ต seure code 
const handleAccessTask =() => {
  if(secureCode ===""){
    Swal.fire({
      title: "คำเตือน",
      text: "กรุณากรอก Secure Code",
      icon: "warning"
    });
    return;
  }
  // check secure code 
  if(secureCode.toLocaleLowerCase() === "dtisau"){
    // เปิดหน้า /hometask
    router.replace("/hometask");
  }else{
    Swal.fire({
      title: "คำเตือน",
      text: "กรุณากรอก Secure Code ให้ถูกต้อง",
      icon: "warning"
    });
  }
}
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
        value={secureCode}
        onChange={(e) => setSecureCode(e.target.value)}
        placeholder="Enter Secure Code"
        className="w-100 mt-10 p-2 border border-gray-500 rounded-md flex mx-auto"
      />
      {/* ปุ่มเข้าใช้งาน */}
      <button onClick={handleAccessTask} className="w-100 mt-5 p-2 border border-gray-500 rounded-md flex mx-auto bg-blue-500 text-white hover:bg-blue-700">
        <span className="mx-auto"> เช้าใช้งาน </span>
      </button>
      {/* แสดง footer */}
      <Footer />
    </div>
  );
}
