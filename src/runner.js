const { workerData, parentPort } = require("worker_threads");
const urls = ['https://frontendkey.github.io/blogPosts.json', 'https://joelee.works'];
const { SocksProxyAgent } = require('socks-proxy-agent');
const axios = require('axios');
(async () => {
    const proxies = workerData.proxie[workerData.thread_count];
    for(proxie of proxies) {
    try {
    await axios({ 
        url:`${urls[Math.floor(Math.random()*urls.length)]}`,
        timeout: 500,
        httpsAgent: new SocksProxyAgent(`${proxie}`)
    }).then(r=>{
        if(r.status == 200) {
            parentPort.postMessage(proxie)
        }
    }).catch(err=> {})
    }catch(e) {}
    parentPort.postMessage(`tested-${proxie}`);
    }
    parentPort.postMessage(`end`);
})();
