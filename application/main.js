export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('genadis/aurelia-mdl');

    aurelia.start().then(() => aurelia.setRoot());
}