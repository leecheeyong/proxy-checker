# "Multi Thread" Proxy Checker
A **FAST** node.js proxy checker that validates and filter out working **SOCKS4** & **SOCKS5** proxies from a **raw & unfiltered** source

> The scripts are not using up lots of CPU, but it's just significantly faster than running a single instance (runner)

## About
- Easy to use
- Multi threaded (configurable)
- Significantly faster
- No duplicated entries
- Capable of processing/checking lots of proxies from raw data
- Output as an array in `JSON` form (both `socks5.json` & `socks4.json`)

<img width="418" alt="image" src="https://user-images.githubusercontent.com/81070048/236698544-ae6d2149-e2c9-48f2-8efb-b7b1d8c90ecc.png">

## Setup
- `socks4` & `socks5` proxies list urls are included, but feel free to edit or add more urls to the `socks4URL` & `socks5URL` array. 
> Note that the lists (contents that are fetched from the urls) **must be formatted** in [this way (example)](https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt)
  ```
  npm install 
  npm start 
  ```

## Contribute
Feel free to open a pull request with any code/feature improvements

## License
This project is available as an open source under the terms of the [MIT License](./LICENSE)
