let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  async redirects() {
    const registerLink = "https://onk.style/s/9yeK7WEimtkjp8m"
    const baseRedirects = [
      {
        source: '/register',
        destination: registerLink,
        permanent: false,
      },
    ]

    // Also merge userConfig.redirects() if it exists
    if (userConfig?.redirects) {
      const userRedirects =
        typeof userConfig.redirects === 'function'
          ? await userConfig.redirects()
          : userConfig.redirects

      return [...baseRedirects, ...userRedirects]
    }

    return baseRedirects
  },
}

if (userConfig) {
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else if (key !== 'redirects') {
      // Avoid overriding the merged redirects function
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
