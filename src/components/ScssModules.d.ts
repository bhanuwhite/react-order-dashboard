
declare module '*.module.scss' {
    const ScssModule: { [className: string]: string };
    export = ScssModule;
}