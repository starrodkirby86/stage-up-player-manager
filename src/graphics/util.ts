export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type ToJson<T> = {
  [P in keyof T as Exclude<T[P], undefined> extends Json ? P : never]: Exclude<T[P], undefined>;
};
