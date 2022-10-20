import markdownlint from 'markdownlint';

export default (input: string) => {
  const options = {
    strings: {
      input: input,
    },
    config: {
      default: true,
      MD013: false,
    },
  };

  let resString: string = '';

  //Switch to sync version
  const res = markdownlint.sync(options);

  if (res && res.toString()) {
    resString = res.toString();
  }

  if (resString !== '') {
    return [
      {
        message: resString,
      },
    ];
  }

  return [];
};
