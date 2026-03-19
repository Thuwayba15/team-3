import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Did this to avoid cross origin
     This solves that 401 error, its a quick fix
     The real fix must be on the backend to allow CORS from localhost:3000
     This is just a quick fix so that we can continue for now */
  async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://themathgenie.com/api/:path*",
            },
        ];
    },
  reactCompiler: true,
};

export default nextConfig;
