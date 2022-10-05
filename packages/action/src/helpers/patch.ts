import markdownTemplate from '../functions/markdownTemplate';
import type { InputOptions, Plugin } from 'rollup';
import { dirname, join } from 'path';

const plugin: Plugin = {
  name: '@compliancepal/spectral-functions',
  buildStart(options) {},
  options(rawOptions): InputOptions {
    const external = rawOptions.external;

    if (typeof external === 'function') {
      return {
        ...rawOptions,
        external: <typeof external>((id, importer, isResolved) => {
          console.log(id);
          return external(id, importer, isResolved);
        }),
      };
      // if (join(dirname(path), '.spectral.js') === rawOptions.input) {
      // }
    }

    return rawOptions;
  },
  resolveId(source) {
    // console.log('source', ...arguments);
    if (source === '@stoplight/spectral-functions') {
      return source; // this signals that rollup should not ask other plugins or check the file system to find this id
    }
    return null; // other ids should be handled as usually
  },
  load(id) {
    console.log('id', ...arguments);
    if (id === 'markdownTemplate') {
      return markdownTemplate.toString();
    }
    return null; // other ids should be handled as usually
  },
  api: {
    markdownTemplate,
  },
};

export default plugin;
