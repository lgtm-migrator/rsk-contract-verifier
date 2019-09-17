"use strict";var _socket = _interopRequireDefault(require("socket.io"));
var _Logger = _interopRequireDefault(require("./lib/Logger"));
var _config = _interopRequireDefault(require("./lib/config"));
var pkg = _interopRequireWildcard(require("../package.json"));
var _http = _interopRequireDefault(require("http"));
var _Api = _interopRequireDefault(require("./lib/Api"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};if (obj != null) {var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const log = (0, _Logger.default)(pkg.name, _config.default.log);
const env = process.env['NODE_ENV'];
if (!env) process.env['NODE_ENV'] = 'production';
const port = process.env['PORT'] || _config.default.port;
const address = process.env['ADDRESS'] || _config.default.address;
const app = _http.default.createServer((req, res) => res.end());
const io = new _socket.default(app);
const api = (0, _Api.default)(_config.default, { log });

io.on('connection', socket => {
  socket.on('message', () => {});
  socket.on('disconnect', () => {});
  socket.on('error', err => {
    log.debug('Socket Error: ' + err);
  });

  socket.on('data', payload => {
    try {
      api.run(payload, socket);
      log.trace(JSON.stringify(payload));
    } catch (err) {
      log.debug(`Action: ${payload.action}, ERROR: ${err}`);
    }
  });
});

app.listen(port, address, () => {
  log.info(`listening on ${address}:${port}`);
});