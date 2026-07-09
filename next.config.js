/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
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
};

module.exports = nextConfig;
