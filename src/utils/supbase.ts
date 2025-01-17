import Eyecatch from "@/components/eyecatch";
import { createClient } from "@supabase/supabase-js";
import { error } from "console";
import { Upload } from "lucide-react";
import { title } from "process";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_URL || "",
  process.env.NEXT_PUBLIC_API_KEY || ""
);

export const insertCategory = async (categoryName: string) => {
  const { error } = await supabase
    .from("categories")
    .insert({ name: categoryName });
};

export const selectCategories = async () => {
  const { data, error } = await supabase.from("categories").select();
  if (data) {
    return data.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  } else {
    return [];
  }
};

export const uploadEyecatchImage = async (UploadFile: File) => {
  const { data, error } = await supabase.storage
    .from("thumbnails")
    .upload(`imgs/${UploadFile.name}`, UploadFile, {
      cacheControl: "3600",
      upsert: false,
    });
  return data ? data.path : error;
};

export const insertPost = async (
  title: string,
  body: string,
  categoryId: number,
  eyecatchUrl: string
) => {
  const { error } = await supabase.from(`posts`).insert({
    title,
    body,
    // category_Id: categoryId,
    category_id: categoryId,
    eyecatch_url: eyecatchUrl,
  });
  return error;
};
export const selectPosts = async () => {
  const { data, error } = await supabase.from("posts").select();
  if (data) {
    return data.map((post) => ({
      ...post,
      slug: post.id,
      eyecatch: post.eyecatch_url,
    }));
  } else {
    return [];
  }
};
export const selectPost = async (slug: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", slug)
    .limit(1);
  console.log(data);
  if (data && data.length === 1) {
    return { ...data[0], slug: data[0].id, eyecatch: data[0].eyecatch_url };
  } else {
    return null;
  }
};
