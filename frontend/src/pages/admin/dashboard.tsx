import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AdminDashboardProps {
  blogs: any[];
  poems: any[];
  articles: any[];
  gallery: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('blogs');
  const [data, setData] = useState<AdminDashboardProps>({
    blogs: [],
    poems: [],
    articles: [],
    gallery: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [blogs, poems, articles, gallery] = await Promise.all([
          axios.get(`${process.env.API_URL}/blogs`, { headers }),
          axios.get(`${process.env.API_URL}/poems`, { headers }),
          axios.get(`${process.env.API_URL}/articles`, { headers }),
          axios.get(`${process.env.API_URL}/gallery`, { headers })
        ]);

        setData({
          blogs: blogs.data,
          poems: poems.data,
          articles: articles.data,
          gallery: gallery.data
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/admin/login');
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['blogs', 'poems', 'articles', 'gallery'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {data[activeTab as keyof AdminDashboardProps]?.map((item: any) => (
              <div
                key={item._id}
                className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => {/* Implement edit functionality */}}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {/* Implement delete functionality */}}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {item.excerpt && (
                  <p className="mt-2 text-sm text-gray-500">{item.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}