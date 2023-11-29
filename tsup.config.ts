import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        core: 'core/src/index.ts',
        index: 'src/index.ts',
        'connectors/petra': 'core/src/connectors/petra.ts',
        'connectors/pontem': 'core/src/connectors/pontem.ts',
        'connectors/razor': 'core/src/connectors/razor.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    treeshake: true,
    splitting: true,
})