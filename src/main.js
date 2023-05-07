const axios = require('axios')
const chalk = require('chalk');
const { Worker } = require("worker_threads");
const thread_count = 128;
const fs = require('fs');
const validSocks4 = [];
const validSocks5 = [];
var validCount = 0;
const socks4URL = ['https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt', 'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks4.txt', 'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks4/socks4.txt'];
const socks5URL = ['https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt', 'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt', 'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks5/socks5.txt'];
var socks4 = [];
var socks5 = [];
const timeStart = performance.now();

const getTime = (d) => {
  d = new Date(1000*Math.round(d/1000));
  function pad(i) { return ('0'+i).slice(-2); }
  return d.getUTCHours() + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())
}

(async () => {
console.log(chalk`{bgBlue Proxy Checker} {yellow by Joe Lee} {grey (https://github.com/leecheeyong/proxy-checker)}`)
console.log(chalk`{bgCyan RUN} {yellow with ${thread_count} threads}`)
for(s4 of socks4URL) { console.log(chalk`{bgCyan LOAD}{bgYellow socks4} {grey from ${s4.slice(8, -20)}...}`); await axios.get(s4).then(r=> socks4 = socks4.concat(r.data.split("\n").map(e=> `socks5://${e}`))).catch(err=>{}) }
for(s5 of socks5URL) { console.log(chalk`{bgCyan LOAD}{bgYellow socks5} {grey from ${s4.slice(8, -20)}...}`);  await axios.get(s5).then(r=> socks5 = socks5.concat(r.data.split("\n").map(e=> `socks4://${e}`))).catch(err=>{}) }
socks4 = socks4.concat(socks5)
const proxie = [];
const proxies = socks4.filter(r=> r.startsWith('socks4://') || r.startsWith("socks5://"));
var left = 0;
for (let i = 0; i < proxies.length; i += (proxies.length / thread_count)) {
    proxie.push(proxies.slice(i, i + (proxies.length / thread_count)));
}
async function createWorker(i) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker("./runner.js", {
        workerData: { thread_count: i, proxie },
      });
      worker.on("message", (data) => {
        if(data.startsWith('socks4')) validSocks4.push(data);
        if(data.startsWith('socks5')) validSocks5.push(data);
        if(data.startsWith('socks5') || data.startsWith('socks4')) console.log(chalk.bgGreen("VALID :"), chalk.bold(data), chalk`{green (${getTime(performance.now() - timeStart)} - ${validCount += 1})}`)
        if(data.startsWith('tested')) console.log(chalk`{bgYellow ${left += 1}/${proxies.length}}: ${chalk.dim(data.slice(7))}`)
        if(data == 'end') {
          worker.terminate()
          resolve(data)
        }
      });
      worker.on("error", (msg) => {
        reject(`An error ocurred: ${msg}`);
      });
    });
}

const workerPromises = [];
for (let i = 0; i < thread_count; i++) {
  workerPromises.push(createWorker(i));
}

await Promise.all(workerPromises);

console.log(chalk`{bgGreen - Done -} {yellow in ${getTime(performance.now() - timeStart)}} `)
console.log(chalk`{bgGreen - Found -} {bgBlue ${chalk.bold(validSocks4.length)} socks4} & {bgBlue ${chalk.bold(validSocks5.length)} socks5} proxies`)
fs.writeFileSync('./socks4.json', JSON.stringify([...new Set(validSocks4)]))
fs.writeFileSync('./socks5.json', JSON.stringify([...new Set(validSocks5)]))
})()
