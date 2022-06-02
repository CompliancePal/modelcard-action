const fs = require('fs')
const yaml = require('js-yaml')

const MLPROJECT_PATH = './MLproject'

if (fs.existsSync(MLPROJECT_PATH)) {
  console.log('MLproject file found')
} else {
  console.log('MLproject file missing!')
  process.exit(1)
}

try {
  const mlproject = yaml.load(fs.readFileSync(MLPROJECT_PATH, 'utf8'))
  console.log('MLproject file opened')
  const modelcard_path = mlproject.modelcard

  //Check that modelcard is defined in the MLproject file
  if (!modelcard_path) {
    console.log("'modelcard' property not found in MLproject file!")
    process.exit(1)
  }

  try {
    const modelcard = yaml.load(fs.readFileSync(modelcard_path, 'utf8'))
    console.log('Model card file opened')

    // Do stuff with the model card file
    
  } catch (e) {
    console.log('Could not open model card file\n:', e)
    process.exit(1)
  }

} catch (e) {
  console.log('Could not open MLproject file\n:', e)
  process.exit(1)
}
