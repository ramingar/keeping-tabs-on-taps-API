import configProd from './production';
import configDev from './development';
import configTest from './test';

const config = (app) => app.get('env') === 'production' ?
    configProd :
    app.get('env') === 'test' ? configTest : configDev;

export default config;
