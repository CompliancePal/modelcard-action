import markdownlint from 'markdownlint'

export default (input: string) => {
  const options = {
    'strings': {
      'input': input,
    },
  };
  
  let resString: string = ''
  markdownlint(options, (err, res) => {
    if (!err && res && res.toString()) {
      resString = res.toString();
    } else if (err) {
      console.log('ERROR',err)
    }
  })

  return [
    {
      message: resString,
    },
  ];
};