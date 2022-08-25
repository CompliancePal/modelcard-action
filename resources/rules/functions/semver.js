export default (input) => {
  const versionParts = input.split('.');

  if (versionParts.length != 3 || versionParts.some((part) => isNaN(part))) {
    return [
      {
        message:
          'Version name must be in format MAJOR.MINOR.PATCH, see semantic versioning (https://semver.org/)',
      },
    ];
  }
};
