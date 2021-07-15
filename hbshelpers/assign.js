module.exports = function assign(...options) {
  console.log(options[options.length - 1].fn(this))
  var temp = JSON.parse(options[options.length - 1].fn(this));
  console.log('start___')
  console.log(temp)
  console.log('stop____')
  var g = JSON.stringify(Object.assign({},...temp));
  var f = g.split("~")
  var str = "";
  for (let i = 0; i < f.length; i++) {
    if (i < f.length - 1 && (f[i + 1].startsWith('function()') || f[i + 1].startsWith('HitchhikerJS'))) {
      str = str.concat(f[i].slice(0,-1));
    }
    else if (i > 0 && (f[i - 1].startsWith('function()') || f[i - 1].startsWith('HitchhikerJS'))) {
      str = str.concat(f[i].slice(1));
    }
    else {
      str = str.concat(f[i])
    }
  }
  console.log('output___')
  console.log(str)
  return str
}