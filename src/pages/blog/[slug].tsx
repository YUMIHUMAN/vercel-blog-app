import Eyecatch from "@/components/eyecatch";
import Layout from "@/components/layout";
import Pagenation from "@/components/pagenation";
import PostCategory from "@/components/post-category";
import PostHeader from "@/components/post-header";
import TwoColumnLayout from "@/components/two-column-layout";
import { Post } from "@/styles/types/blog";
import { selectPost } from "@/utils/supbase";
import { useRouter } from "next/router";
import { ClassAttributes, HTMLAttributes, useEffect, useState } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";

type HeadingProps = ClassAttributes<HTMLHeadingElement> &
  HTMLAttributes<HTMLHeadingElement> &
  ExtraProps;

const H1 = ({ children }: HeadingProps) => {
  return <h1 className="text-3xl text-3xl m-l-2">{children}</h1>;
};

type ParagraphProps = ClassAttributes<HTMLParagraphElement> &
  HTMLAttributes<HTMLParagraphElement> &
  ExtraProps;
const P = ({ children }: ParagraphProps) => {
  return <p className="text-base">{children}</p>;
};

const DetailPage = () => {
  const [post, setPost] = useState<Post>();
  const [blogId, setBlogId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    //クエリパラメーターを取得する
    const slug = router.query.slug;
    console.log(slug);
    if (typeof slug === "string") {
      setBlogId(slug);
    }
  }, [router.query]);

  useEffect(() => {
    if (blogId === "") {
      return;
    }
    const fetchPost = async () => {
      const data = await selectPost(blogId);
      if (!data) {
        return;
      }
      setPost(data);
    };
    fetchPost();
  }, [blogId]);

  return (
    <Layout>
      <div className="flex flex-col items-center">
        {post && <PostHeader post={post} />}
      </div>
      <Eyecatch
        src={
          post
            ? `https://ooegbiekzxzcmmphylsv.supabase.co/storage/v1/object/public/thumbnails/${post.eyecatch}`
            : "/images/eyecatch.jpg"
        }
        width={568}
        height={288}
      />
      <TwoColumnLayout>
        <div className="flex flex-col flex-1 text-base leading-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ h1: H1, p: P }}
          >
            {post && post.body}
          </ReactMarkdown>
          {post && post.body}
        </div>
        <PostCategory />
      </TwoColumnLayout>
      <Pagenation
        prevText="前の記事へ"
        prevUrl="/blog/0001"
        nextText="次の記事へ"
        nextUrl="/blog/0003"
      />
      <h1>詳細ページ</h1>
    </Layout>
  );
};
export default DetailPage;
