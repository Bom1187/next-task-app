"use client";

import AppName from "@/components/AppName";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClients";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      const id = new URLSearchParams(window.location.search).get("id");
      if (!id) {
        await Swal.fire("เกิดข้อผิดพลาด", "ไม่พบข้อมูลงานที่ต้องการแก้ไข", "error");
        router.push("/hometask");
        return;
      }

      const { data, error } = await supabase
        .from("task_tb")
        .select("title, detail, image_url, isCompleted")
        .eq("id", id)
        .single();

      if (error || !data) {
        await Swal.fire(
          "เกิดข้อผิดพลาด",
          error?.message || "ไม่พบข้อมูลงาน",
          "error",
        );
        router.push("/hometask");
        return;
      }

      setTaskId(id);
      setTitle(data.title);
      setDetail(data.detail);
      setImageUrl(data.image_url);
      setImagePreview(data.image_url);
      setIsCompleted(data.isCompleted);
      setIsLoading(false);
    };

    loadTask();
  }, [router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveData = async () => {
    if (taskId === null || title.trim() === "" || detail.trim() === "") {
      await Swal.fire("คำเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
      return;
    }

    let updatedImageUrl = imageUrl;
    if (imageFile) {
      const newFileName = `dtisau_${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("table_bk")
        .upload(newFileName, imageFile);

      if (uploadError) {
        await Swal.fire("เกิดข้อผิดพลาด", uploadError.message, "error");
        return;
      }

      updatedImageUrl = supabase.storage
        .from("table_bk")
        .getPublicUrl(newFileName).data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("task_tb")
      .update({
        title: title.trim(),
        detail: detail.trim(),
        image_url: updatedImageUrl,
        isCompleted,
      })
      .eq("id", taskId);

    if (updateError) {
      await Swal.fire("เกิดข้อผิดพลาด", updateError.message, "error");
      return;
    }

    await Swal.fire("สำเร็จ", "แก้ไขข้อมูลงานเรียบร้อยแล้ว", "success");
    router.push("/hometask");
  };

  const handleResetData = () => {
    setImageFile(null);
    setImagePreview(imageUrl);
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
        <h1 className="text-center text-2xl font-bold">แก้ไขข้อมูลงาน</h1>
        <h3 className="mt-5 mb-2">ป้อนหัวข้องาน</h3>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="border bg-amber-50 rounded-md p-2 w-full"
        />
        <h3 className="mt-5 mb-2">ป้อนรายละเอียดงาน</h3>
        <textarea
          rows={5}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          className="w-full border rounded-md p-2 bg-amber-50"
        ></textarea>
        <h3 className="mt-5 mb-2">เลือกรูป</h3>
        <input
          type="file"
          id="selectImagefile"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <label
          htmlFor="selectImagefile"
          className="border rounded-md p-2 w-full bg-green-50 hover:bg-green-400 cursor-pointer"
        >
          คลิกเพื่อเลือกรูป
        </label>
        {imagePreview && (
          <div className="mt-5">
            <img src={imagePreview} alt="Preview" width={120} height={120} />
          </div>
        )}
        <h3 className="mt-5 mb-2">สถานะงาน</h3>
        <select
          value={isCompleted ? "1" : "0"}
          onChange={(event) => setIsCompleted(event.target.value === "1")}
          className="border rounded-md p-2 w-full bg-amber-50"
        >
          <option value="1">✔ เสร็จ</option>
          <option value="0">❌ ไม่เสร็จ</option>
        </select>

        <button
          onClick={handleSaveData}
          disabled={isLoading}
          className="block w-full mt-3 bg-blue-500 p-2 rounded-md text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50"
        >
          บันทึกข้อมูลงาน
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
