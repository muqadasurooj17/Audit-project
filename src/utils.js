export function safeJSONParse(str) {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }
  