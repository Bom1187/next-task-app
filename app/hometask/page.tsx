"use client";

import AppName from "@/components/AppName";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClients";
import Swal from "sweetalert2";

// รูปแบบข้อมูลจาก Supabase
type Task = {
  id: number | string;
  title: string;
  detail: string;
  image_url: string;
  isCompleted: boolean;
};

export default function Page() {
  // state สำหรับเก็บข้อมูล task ทั้งหมด
  const [tasks, setTasks] = useState<Task[]>([]);

  // ดึงข้อมูลจาก Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error: fetchError } = await supabase
        .from("task_tb")
        .select("id, image_url, title, detail, isCompleted")
        .order("update_at", { ascending: false });

      // ตรวจสอบ error
      if (fetchError) {
        console.error("Fetch Error:", fetchError);
        return;
      }

      // เก็บข้อมูลลง state
      setTasks(data || []);
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId: number | string) => {
    const result = await Swal.fire({
      title: "ต้องการลบข้อมูลหรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("task_tb")
      .delete()
      .eq("id", taskId);

    if (deleteError) {
      await Swal.fire("เกิดข้อผิดพลาด", deleteError.message, "error");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
    await Swal.fire("สำเร็จ", "ลบข้อมูลงานเรียบร้อยแล้ว", "success");
  };

  return (
    <div className="w-full">
      {/* แสดงชื่อแอป */}
      <div className="text-center mt-20">
        <AppName />
      </div>

      {/* แสดงรูป logo */}
      <Image
        src="https://tuttynrvhcscplukufxt.supabase.co/storage/v1/object/public/table_bk/task_logo.png"
        alt="Logo"
        width={100}
        height={100}
        className="mx-auto mt-10"
      />

      {/* ปุ่มเพิ่ม Task */}
      <div className="w-4/5 text-end mt-10 mx-auto">
        <Link
          href="/addtask"
          className="px-8 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700"
        >
          เพิ่ม Task
        </Link>
      </div>

      {/* ตาราง Task */}
      <table className="w-4/5 mt-10 mx-auto border border-gray-500 bg-gray-100">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">รูปงาน</th>

            <th className="border border-gray-500 px-4 py-2">ชื่องาน</th>

            <th className="border border-gray-500 px-4 py-2">รายละเอียดงาน</th>

            <th className="border border-gray-500 px-4 py-2">สถานะงาน</th>

            <th className="border border-gray-500 px-4 py-2">ลบ/แก้ไข</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              {/* รูปงาน */}
              <td className="border border-gray-500 px-4 py-2 text-center">
                <img
                  src={task.image_url}
                  alt={task.title}
                  width={100}
                  height={100}
                  className="mx-auto object-cover"
                />
              </td>

              {/* ชื่องาน */}
              <td className="border border-gray-500 px-4 py-2">{task.title}</td>

              {/* รายละเอียดงาน */}
              <td className="border border-gray-500 px-4 py-2">
                {task.detail}
              </td>

              {/* สถานะงาน */}
              <td className="border border-gray-500 px-4 py-2 text-center">
                {task.isCompleted ? (
                  <span className="text-green-600 font-bold">✔ เสร็จ</span>
                ) : (
                  <span className="text-red-600 font-bold">❌ ไม่เสร็จ</span>
                )}
              </td>

              {/* ปุ่มแก้ไข / ลบ */}
              <td className="border border-gray-500 px-4 py-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    href={`/edittask?id=${encodeURIComponent(task.id)}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* กรณีไม่มีข้อมูล */}
          {tasks.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="border border-gray-500 px-4 py-8 text-center text-gray-500"
              >
                ยังไม่มีข้อมูลงาน
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Footer />
    </div>
  );
}
