import * as github from '@actions/github';
import { ISpectralDiagnostic } from '@stoplight/spectral-core';

const makeSummary = (diagnostics: ISpectralDiagnostic[]) =>
  diagnostics
    .map((problem) => {
      console.log(problem);
      return `- \`${problem.path.join('.')}\``;
    })
    .join('\n');

// TODO: Determine a more elaborate mode reaching the conlcusion based on the severity of the diagnostics
const getConclusion = (diagnostics: ISpectralDiagnostic[]) =>
  diagnostics.length > 0 ? 'failure' : 'success';

export const makeCheckRun = (
  diagnostics: ISpectralDiagnostic[],
  opts: {
    token: string;
    started_at: string;
  },
) => {
  const octokit = github.getOctokit(opts.token);

  return octokit.request('POST /repos/{owner}/{repo}/check-runs', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    head_sha: github.context.payload.pull_request!.head.sha,
    name: 'modelcard validation',
    conclusion: getConclusion(diagnostics),
    output: {
      title: 'Validation problems',
      summary: makeSummary(diagnostics),
    },
    started_at: opts.started_at,
    completed_at: new Date().toISOString(),
  });
};
