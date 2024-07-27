export const sha256Buffer = async (data: string) => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data)
  );

  return buffer;
};

export const hexString = (buffer: ArrayBuffer) => {
  const text = [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return text;
};

export const sha256 = {
  hash: async (data: string) => {
    const buffer = await sha256Buffer(data);
    const text = hexString(buffer);

    return text;
  },

  verify: async (data: string, hash: string) => {
    const buffer = await sha256Buffer(data);
    const text = hexString(buffer);

    return text === hash;
  },
};
