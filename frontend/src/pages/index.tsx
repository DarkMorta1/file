import { GetServerSideProps } from 'next';
import axios from 'axios';
import Head from 'next/head';

interface HomeProps {
  latestBlogs: any[];
  latestPoems: any[];
  latestArticles: any[];
}

export default function Home({ latestBlogs, latestPoems, latestArticles }: HomeProps) {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Personal CMS</title>
        <meta name="description" content="Welcome to my personal CMS" />
      </Head>

      <h1 className="text-4xl font-bold mb-8">Welcome to My Personal CMS</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
          {latestBlogs.map((blog) => (
            <div key={blog._id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium">{blog.title}</h3>
              <p className="text-gray-600 mt-2">{blog.excerpt}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Latest Poems</h2>
          {latestPoems.map((poem) => (
            <div key={poem._id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium">{poem.title}</h3>
              <p className="text-gray-600 mt-2">{poem.excerpt}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Latest Articles</h2>
          {latestArticles.map((article) => (
            <div key={article._id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium">{article.title}</h3>
              <p className="text-gray-600 mt-2">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const apiBase = process.env.API_URL || 'http://localhost:5000/api';

  try {
    const [blogsRes, galleryRes] = await Promise.all([
      axios.get(`${apiBase}/blogs?limit=3`).catch(() => ({ data: [] })),
      axios.get(`${apiBase}/gallery?limit=6`).catch(() => ({ data: [] })),
    ]);

    return {
      props: {
        latestBlogs: blogsRes.data || [],
        latestPoems: [],
        latestArticles: galleryRes.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        latestBlogs: [],
        latestPoems: [],
        latestArticles: [],
      },
    };
  }
};