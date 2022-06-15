import { ISpectralDiagnostic } from '@stoplight/spectral-core';

export const makeSummary = (diagnostics: ISpectralDiagnostic[]) =>
  diagnostics
    .map((problem) => {
      console.log(problem);
      return `- \`${problem.path.join('.')}\``;
    })
    .join('\n');
