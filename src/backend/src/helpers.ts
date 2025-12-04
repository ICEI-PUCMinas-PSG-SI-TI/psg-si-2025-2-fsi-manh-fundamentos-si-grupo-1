import * as z4 from "zod/v4";

export const z4Base64File = z4.string().superRefine((value, ctx) => {
  if (!value.match(/^data:image\/(.*?);base64,/)) {
    ctx.addIssue("A base64 não é uma imagem ou está formatada incorretamente.");
  }
});

export function bufferTostring(byteBuffer: Uint8Array): string {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(byteBuffer);
}
