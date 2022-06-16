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
  markdownlint(options, (err, res) => {
    if (!err && res && res.toString()) {
      resString = res.toString();
    } else if (err) {
      console.log('ERROR', err);
    }
  });

  if (resString !== '') {
    return [
      {
        message: resString,
      },
    ];
  }
};
