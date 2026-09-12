"use client";

import AppName from "@/components/AppName";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClients";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter(); // สร้าง router สำหรับเปลี่ยนหน้า

  // สร้าง state สำหรับเก็บค่าข้อมูลงาน
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ฟังก์ชั่นเลือกรูปและแสดง preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // กำหนดค่าให้กับ imageFile เพื่อใช้อัปปยัง supabase
      setImagePreview(URL.createObjectURL(file)); // แสดง preview ของรูป
    }
  };

  // ฟังก์ชั่นบันทึกข้อมูลงาน
  const handleSaveData = async () => {
    //  Validate UI
    if (title === "" || detail === "" || imageFile === null) {
      Swal.fire({
        title: "คำเตือน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    // Upload Image to Supabase and get Image URL from Bucket
    // เปลี่ยนชื่อรูป
    const newFileName = `dtisau_${Date.now()}_${imageFile.name}`;
    // อัปโหลดรูป
    const { error: uploadError } = await supabase.storage
      .from("table_bk")
      .upload(newFileName, imageFile);

    // ตรวจสอบการอัปโหลด
    if (uploadError) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: uploadError.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    // เอารที่อยู่องรูปมาใสส่ในตัวแปรเพื่อบันทึกลงตาราง
    const { data } = supabase.storage.from("table_bk").getPublicUrl(newFileName);
    const image_url = data.publicUrl;

    // Save Data to Supabase Database
    const { error: saveError } = await supabase.from("task_tb").insert({
      title: title,
      detail: detail,
      image_url: image_url,
      isCompleted: isCompleted,
    });

    //ตรวจสอบบันทึกข้อมูล
    if (saveError) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: saveError.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // ตรวจสอบแล้วไม่มีข้อผิดพลาด
    await Swal.fire({
      title: "สำเร็จ",
      text: "บันทึกข้อมูลงานเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
    });
    // กลับไปที่หน้าหลักหลังจากบันทึกข้อมูลสำเร็จ
    router.back(); //กลับไปหนาห่อนหน้า
  };

  // ฟังก์ชั่นรีเซ็ตข้อมูลงาน
  const handleResetData = () => {
    setTitle("");
    setDetail("");
    setImageFile(null);
    setImagePreview(null);
    setIsCompleted(false);
  };

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
        <h1 className="text-center text-2xl font-bold">เพิ่มข้อมูลงาน</h1>
        <h3 className="mt-5 mb-2">ป้อนหัวข้องาน</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ป้อนหัวข้องาน"
          className="border bg-amber-50 rounded-md p-2 w-full"
        />
        <h3 className="mt-5 mb-2">ป้อนรายละเอียดงาน</h3>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={5}
          className="w-full border rounded-md p-2 bg-amber-50"
        ></textarea>
        <h3 className="mt-5 mb-2">เลือกรูป</h3>
        <input
          type="file"
          id="selectImagefile"
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
        <label
          htmlFor="selectImagefile"
          className="border rounded-md p-2 w-full bg-green-50 hover:bg-green-400 cursor-pointer"
        >
          คลิกเพื่อเลือกรูป
        </label>
        {/* ส่วนของ image preview */}
        {imagePreview && (
          <div className="mt-5">
            <img src={imagePreview} alt="Preview" width={120} height={120} />
          </div>
        )}
        {/* -------------------- */}

        <h3 className="mt-5 mb-2">สถานะงาน</h3>
        <select
          value={isCompleted == true ? "1" : "0"}
          onChange={(e) => setIsCompleted(e.target.value === "1")}
          className="border rounded-md p-2 w-full bg-amber-50"
        >
          <option value="1">✔ เสร็จ</option>
          <option value="0">❌ ไม่เสร็จ</option>
        </select>

        <button
          onClick={handleSaveData}
          className="block w-full mt-3 bg-blue-500 p-2 rounded-md text-white hover:bg-blue-700 cursour-pointer"
        >
          บันทึกข้อมูลงาน
        </button>
        <button
          onClick={handleResetData}
          className="block w-full mt-3 bg-orange-500 p-2 rounded-md text-white hover:bg-orange-600 cursor-pointer"
        >
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
