import bcrypt from "bcrypt";
import { env } from "../../../../config/env.service.js";

export const HashText = (plainText) => bcrypt.hash(plainText, env.saltRounds);

export const CompareText = (plainText, cipherText) => bcrypt.compare(plainText, cipherText);
