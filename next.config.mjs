const repositoryName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: repositoryName ? `/${repositoryName}` : '',
  output: 'export',
  reactStrictMode: true,
};

export default nextConfig;
