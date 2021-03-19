
import consola from 'consola'
import app from './src/index.js';

//const consola = require('consola');
//const app = require('./src')
const port = process.env.PORT || 3000;
app.listen(port, () => {
  consola.success(`Find me on port ${port}`);
});
