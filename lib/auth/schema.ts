import { z } from "zod";

export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "パスワードを入力してください")
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
