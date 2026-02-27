module.exports = {
  readFileSync: () => "",
  existsSync: () => false,
  readFile: (_path, _opts, cb) => {
    const callback = typeof _opts === "function" ? _opts : cb;
    callback(new Error("fs.readFile not available"));
  },
  writeFile: (_path, _data, _opts, cb) => {
    const callback = typeof _opts === "function" ? _opts : cb;
    if (callback) callback(null);
  },
};
