import fs from 'fs';
import process from 'process';

function template(name, fields) {
  const contents = fs.readFileSync(`templates/${name}.txt`, 'utf8');
  let result = contents;
  for (const [key, value] of Object.entries(fields)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function separateWithSpace(pascalCase) {
  return pascalCase.replace(/(?<=[a-zA-Z])(?=[A-Z])/g, ' ');
}

function pluralize(string) {
  return string.endsWith('s') ? `${string}es` : `${string}s`;
}

function camelCase(string) {
  return string[0].toLowerCase() + string.slice(1);
}

function snakeCase(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

const commands = {
  generate: (entity, ...args) => {
    const generators = {
      model: (name, ...options) => {
        if (!name) {
          console.error('Model name is required');
          return false;
        }

        if (!/^[a-zA-Z]+$/.test(name)) {
          console.error('Model name must contain only letters');
          return false;
        }

        name = name[0].toUpperCase() + name.slice(1);
        const nameCamelCase = camelCase(name);
        const nameCamelCasePlural = pluralize(nameCamelCase);
        const nameSnakeCase = snakeCase(name);

        const generateTest = !options.includes('--no-test');
        const fileExists = fs.existsSync(`src/models/${name}.ts`);
        const testFileExists = generateTest && fs.existsSync(`tests/models/${name}.test.ts`);

        if (!fs.existsSync('src/models')) fs.mkdirSync('src/models', { recursive: true });
        if (!fs.existsSync('tests/models')) fs.mkdirSync('tests/models', { recursive: true });

        try {
          if (fileExists) {
            console.error(`Model ${name} already exists`);
          } else {
            console.log(`Generating model ${name} at src/models/${name}.ts`);
            fs.writeFileSync(`src/models/${name}.ts`, template('model', { name, nameCamelCase, nameSnakeCase }));
            console.log(`Model ${name} generated`);
          }

          const indexFile = fs.readFileSync('src/models/index.js', 'utf8');
          const newContent = `export { default as ${name} } from './${name}';`;
          if (!indexFile.includes(newContent)) fs.writeFileSync('src/models/index.js', `${indexFile.trim()}\n${newContent}\n`);

          if (!generateTest) return true;
          if (testFileExists) {
            console.error(`Test for Model ${name} already exists`);
          } else {
            console.log(`Generating test for model ${name} at tests/models/${name}.test.ts`);
            fs.writeFileSync(`tests/models/${name}.test.ts`, template('model-test', { name, nameCamelCase, nameSnakeCase, nameSeparated: separateWithSpace(name), nameCamelCasePlural }));
            console.log(`Test for Model ${name} generated`);
          }
          return true;
        } catch (error) {
          console.error(`Error: ${error}`);
          return false;
        }
      },
      service: (name, ...options) => {
        if (!name) {
          console.error('Service name is required');
          return false;
        }

        if (!/^[a-zA-Z]+$/.test(name)) {
          console.error('Service name must contain only letters');
          return false;
        }

        const model = name[0].toUpperCase() + name.slice(1);
        name = model + 'Service';
        const nameSeparated = separateWithSpace(model);
        const nameSeparatedPlural = pluralize(nameSeparated);
        const nameCamelCase = camelCase(name);
        const endpoint = '/' + model.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

        const generateTest = !options.includes('--no-test');
        const fileExists = fs.existsSync(`src/services/${name}.js`);
        const testFileExists = generateTest && fs.existsSync(`tests/services/${name}.test.ts`);
        if (fileExists || testFileExists) {
          console.error(`Service ${name} already exists`);
          return false;
        }
        const modelFileExists = fs.existsSync(`src/models/${model}.ts`);
        if (!modelFileExists) {
          console.log(`Model ${model} does not exist. Generating model ${model}`);
          if (!generators.model(model)) return false;
        }

        if (!fs.existsSync('src/services')) fs.mkdirSync('src/services', { recursive: true });
        if (!fs.existsSync('tests/services')) fs.mkdirSync('tests/services', { recursive: true });

        try {
          console.log(`Generating service ${name} at src/services/${name}.js`);
          fs.writeFileSync(`src/services/${name}.js`, template('service', { name, model, endpoint }));
          console.log(`Service ${name} generated`);

          const indexFile = fs.readFileSync('src/services/index.js', 'utf8');
          const newContent = `export { default as ${name} } from './${name}';`;
          if (!indexFile.includes(newContent)) fs.writeFileSync('src/services/index.js', `${indexFile.trim()}\n${newContent}\n`);

          if (!generateTest) return true;
          console.log(`Generating test for service ${name} at tests/services/${name}.test.ts`);
          fs.writeFileSync(`tests/services/${name}.test.ts`, template('service-test', { name, model, nameSeparatedPlural, nameCamelCase, nameSeparated, endpoint }));
          console.log(`Test for Service ${name} generated`);
          return true;
        } catch (error) {
          console.error(`Error: ${error}`);
          return false;
        }
      }
    };

    const defaultGenerator = () => {
      console.log(`Unknown thing: ${entity}`);
      return false;
    };

    const generator = generators[entity] ?? defaultGenerator;
    return generator(...args);
  }
};

const [command, ...args] = process.argv.slice(2);
if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
if (!commands[command](...args)) {
  console.error(`Command ${command} failed`);
  process.exit(1);
}
