import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true
      },
      {
        source: '/home',
        destination: '/login',
        permanent: true
      },
      {
        source: '/login_mensalista',
        destination: '/login',
        permanent: true
      },
      {
        source: '/portal_mensalista',
        destination: '/login',
        permanent: true
      },
      {
        source: '/servicos',
        destination: '/login',
        permanent: true
      },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true
      },
    ];
  },
};

export default nextConfig;
