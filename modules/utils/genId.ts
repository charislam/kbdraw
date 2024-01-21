import { randomString } from "remeda";

export function genId(length = 8) {
  return randomString(length);
}
