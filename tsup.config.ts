import { defineConfig } from 'tsup'

export default defineConfig({
    format: ['esm', 'cjs'],
    dts: true,
    treeshake: true,
    splitting: true,
})