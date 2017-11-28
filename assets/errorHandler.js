// by Nicholas C. Zakas (MIT Licensed)
// https://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/
function productionize (object) {
  var name,
    method
  
  for (name in object) {
    method = object[name]
    if (typeof method === 'function' && name != 'p5') {
      object[name] = (function (name, method) {
        return function () {
          try {
            return method.apply(this, arguments)
          } catch (ex) {
            console.log(name + '(): ' + ex.message)
          }
        }
      }(name, method))
    }
  }
}
