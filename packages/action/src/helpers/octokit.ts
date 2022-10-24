import * as github from '@actions/github';

const getOctokit = () => {
  if (process.env.TOKEN) {
    const octokit = github.getOctokit(process.env.TOKEN);

    return octokit;
  }

  return;
};

export default getOctokit;
