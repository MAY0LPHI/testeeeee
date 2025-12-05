import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Caminhos centralizados do projeto Hinokami Bot
 */
export const paths = {
  root: path.resolve(__dirname, '../../..'),
  dados: path.resolve(__dirname, '../..'),
  src: path.resolve(__dirname, '..'),
  database: path.resolve(__dirname, '../../database'),
  grupos: path.resolve(__dirname, '../../database/grupos'),
  dono: path.resolve(__dirname, '../../database/dono'),
  midias: path.resolve(__dirname, '../../midias'),
  funcs: path.resolve(__dirname, '../funcs'),
  menus: path.resolve(__dirname, '../menus'),
  utils: path.resolve(__dirname, '../utils'),
  scripts: path.resolve(__dirname, '../.scripts'),
  config: path.resolve(__dirname, '../config.json'),
  session: path.resolve(__dirname, '../../session')
};

export default paths;
