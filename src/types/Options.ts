type IOptionTemplate = "js" | "ts";

export interface ICliOptions {
    projectName: string;
    template: IOptionTemplate;
    usePaths: boolean;
}
