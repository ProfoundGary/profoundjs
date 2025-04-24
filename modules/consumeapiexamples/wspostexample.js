function postnewuser(name,job, result){
   pjs.define("name", { type: 'char', length: 50, refParm: name });
   pjs.define("job", { type: 'char', length: 50, refParm: job });
   pjs.define("result", { type: 'char', length: 50, refParm: result });

    let _data = pjs.httpRequest({
      method: "POST",
      uri: `https://reqres.in/api/users`,
      body: {
        "name": name,
        "job": job
    },
      json: true
    });
    result = _data;
}

exports.run = postnewuser

exports.parms = [
  { type: 'char', length: 50 },
  { type: 'char', length: 50 },
  { type: 'char', length: 250}
]