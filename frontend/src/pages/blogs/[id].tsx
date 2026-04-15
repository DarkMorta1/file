import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!blog) return <div className="text-center py-10">Blog post not found</div>;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <div className="text-gray-500 mb-8">
        {new Date(blog.createdAt).toLocaleDateString()}
      </div>
      
      {blog.image && (
        <div className="relative h-96 mb-8">
          <Image
            src={`http://localhost:5000${blog.image}`}
            alt={blog.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}