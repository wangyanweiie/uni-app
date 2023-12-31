import { writeFileSync } from 'fs';
import axios from 'axios';

async function writeAPI() {
    try {
        const res = await axios.get('http://192.168.3.200:8061/v2/api-docs?group=%E7%B3%BB%E7%BB%9F%E6%9C%8D%E5%8A%A1');
        console.log(res);

        const res2 = JSON.stringify(res.data).replace(/\«|»|\s+/g, '_');

        const apiObj = JSON.parse(res2);

        for (const key in apiObj.paths) {
            const funName = key
                .split('/')
                .filter(item => item && item !== 'api' && item !== 'v1')
                .map((item, index) => {
                    if (index === 0) {
                        return item;
                    } else {
                        return `${item[0].toUpperCase()}${item.slice(1)}`;
                    }
                })
                .join('');

            const method = Object.keys(apiObj.paths[key])[0];

            apiObj.paths[key][method].operationId = `${funName}${method.toUpperCase()}`;
        }

        writeFileSync('./src/json/api.json', JSON.stringify(apiObj));
    } catch (error) {
        console.log(error);

        console.log('出错了');
    }
}

writeAPI();
