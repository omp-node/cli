type IOptionTemplate = "js" | "ts";

export interface ICliOptions {
    resourceName: string;
    template: IOptionTemplate;
    usePaths: boolean;
}
