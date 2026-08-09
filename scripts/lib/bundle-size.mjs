import { brotliCompressSync, constants, gzipSync } from "node:zlib"

export const bundleSizeMetrics = ["raw", "gzip", "brotli"]

export function measureBundleSize(content) {
  return {
    raw: content.length,
    gzip: gzipSync(content, { level: 9 }).length,
    brotli: brotliCompressSync(content, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}
