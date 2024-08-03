export const camelCaseKeys = <T>(obj: any): T => {
    if (Array.isArray(obj)) {
      return obj.map((v) => camelCaseKeys(v)) as unknown as T;
    } else if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = key.replace(/([-_][a-z])/gi, (match) =>
          match.toUpperCase().replace("-", "").replace("_", "")
        );
  
        (result as any)[camelKey] = camelCaseKeys(obj[key]);
        return result;
      }, {} as T);
    }
    return obj;
  };