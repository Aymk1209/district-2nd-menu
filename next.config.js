/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore optional TypeORM dependencies that cause build errors
    config.externals.push({
      'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
      '@sap/hana-client': 'commonjs @sap/hana-client',
      'mysql': 'commonjs mysql',
      'mysql2': 'commonjs mysql2',
      'sqlite3': 'commonjs sqlite3',
      'mssql': 'commonjs mssql',
      'oracledb': 'commonjs oracledb',
      'pg-query-stream': 'commonjs pg-query-stream',
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://aymk1209.github.io" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
