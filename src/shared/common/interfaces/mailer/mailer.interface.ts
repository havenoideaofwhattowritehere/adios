export type IMailOptions =
  | {
      to: string;
      targets?: never;
    }
  | {
      to?: never;
      targets: string[];
    };

export interface IMailTemplate {
  subject: string;
  html: string;
}
