"use client";

import AppName from "@/components/AppName";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    // สร้าง state สำหรับเก็บค่าข้อมูลงาน
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div>
      {/* แสดงชื่อแอป */}
      <div className="text-center mt-40">
        <AppName />
      </div>
      {/* แสดงรูป logo ของแอป */}
      <Image
        src="https://tuttynrvhcscplukufxt.supabase.co/storage/v1/object/public/table_bk/task_logo.png"
        alt="Logo"
        width={100}
        height={100}
        className="mx-auto mt-10"
      />
      {/* ส่วนของการป้อน-เลือกข้อมูลเพื่อบันทึก */}
      <div className="w-200 mx-auto mt-10 border border-gray-500 rounded-xl px-20 py-10">
        <h1 className="text-center text-2xl font-bold">แก้ไขข้อมูลงาน</h1>
        <h3 className="mt-5 mb-2">ป้อนหัวข้องาน</h3>
        <input
          type="text"
          className="border bg-amber-50 rounded-md p-2 w-full"
        />
        <h3 className="mt-5 mb-2">ป้อนรายละเอียดงาน</h3>
        <textarea
          rows={5}
          className="w-full border rounded-md p-2 bg-amber-50"
        ></textarea>
        <h3 className="mt-5 mb-2">เลือกรูป</h3>
        <input type="file" id="selectImagefile" className="hidden" />
        <label
          htmlFor="selectImagefile"
          className="border rounded-md p-2 w-full bg-green-50 hover:bg-green-400 cursor-pointer"
        >
          คลิกเพื่อเลือกรูป
        </label>
        <h3 className="mt-5 mb-2">สถานะงาน</h3>
        <select className="border rounded-md p-2 w-full bg-amber-50">
          <option value="1">✔ เสร็จ</option>
          <option value="0" selected>
            ❌ ไม่เสร็จ
          </option>
        </select>

        <button className="block w-full mt-3 bg-blue-500 p-2 rounded-md text-white hover:bg-blue-700 cursour-pointer">
          บันทึกข้อมูลงาน
        </button>
        <button className="block w-full mt-3 bg-orange-500 p-2 rounded-md text-white hover:bg-orange-600 cursor-pointer">
          รีเซ็ตข้อมูลงาน
        </button>
      </div>
      {/* ลิงค์กลับไปหน้า /hometask */}
      <Link href="/hometask" className="block mt-10 text-gray-600 text-center">
        [กลับไปหน้าหลัก]
      </Link>
      {/* แสดง footer */}
      <Footer />
    </div>
  );
}
