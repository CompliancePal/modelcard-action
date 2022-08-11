import * as github from '@actions/github';
import { ISpectralDiagnostic } from '@stoplight/spectral-core';
import nunjucks from 'nunjucks';
import { load } from 'js-yaml';
import { join } from 'path';

const makeDiagnosticsSummary = (diagnostics: ISpectralDiagnostic[]) =>
  diagnostics
    .map((problem) => {
      console.log(problem);
      return `- \`${problem.path.join('.')}\``;
    })
    .join('\n');

export const renderModelCard = (metadata: string) => {
  const modelcard = load(metadata) as object;

  nunjucks
    .configure(join(__dirname, 'templates'), {
      autoescape: true,
    })
    .addFilter(
      'date',
      (date: Date) =>
        `${date.getUTCDate()}-${
          date.getUTCMonth() + 1
        }-${date.getUTCFullYear()}`,
    );

  return nunjucks.render('dummy.njk', modelcard).trim();
};

// TODO: Determine a more elaborate mode reaching the conlcusion based on the severity of the diagnostics
const getConclusion = (diagnostics: ISpectralDiagnostic[]) =>
  diagnostics.length > 0 ? 'failure' : 'success';

export const makeOutput = (
  diagnostics: ISpectralDiagnostic[],
  metadata: string,
) => {
  return diagnostics.length > 0
    ? {
        title: 'Validation problems',
        summary: makeDiagnosticsSummary(diagnostics),
      }
    : {
        title: 'Model cards',
        summary: renderModelCard(metadata),
      };
};

export const makeCheckRun = (
  diagnostics: ISpectralDiagnostic[],
  opts: {
    metadata: string;
    token: string;
    started_at: string;
  },
) => {
  const octokit = github.getOctokit(opts.token);

  return octokit.request('POST /repos/{owner}/{repo}/check-runs', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    head_sha:
      github.context.eventName === 'pull_request'
        ? github.context.payload.pull_request!.head.sha
        : github.context.sha,
    name: 'modelcard validation',
    conclusion: getConclusion(diagnostics),
    output: makeOutput(diagnostics, opts.metadata),
    started_at: opts.started_at,
    completed_at: new Date().toISOString(),
  });
};
