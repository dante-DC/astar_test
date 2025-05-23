import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env file
dotenv.config();

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  baseUrl: process.env.BASE_URL || "https://astarfinancial.com.au/",
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || "30000"),
  filePath: __filename,
  dirPath: __dirname,
};