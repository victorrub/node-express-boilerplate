export function SetBodyFormData(formData: Object): string {
  let body = "";

  for (const key in formData) {
    const value = formData[key];
    body += `${key}=${value}&`;
  }

  return body.substring(0, body.length - 1);
}
