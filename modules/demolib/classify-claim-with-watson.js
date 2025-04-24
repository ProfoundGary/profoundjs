
var fs = require('fs'); 
const { IamAuthenticator } = require('ibm-watson/auth');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var visual_recognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'DsBcB0eyFLnJsIGlMEPPEBv9RNpbISyrSDMlAlk4bFxV' 
});

var classify = function(imageFileName) {

  imageFileName = "/home/bitnami/profoundjs/htdocs/profoundui/userdata/images/claims/" + imageFileName.trim(); 
  var params = {
    classifier_ids: ["Insurance_Claims_Demo_1983199"],
    images_file: fs.createReadStream(imageFileName)
  };
  var output = profound.fiber.call(visual_recognition, visual_recognition.classify, params);
  var image = output.images[0]
  var classifiers = image.classifiers;
  if (classifiers.length === 0) return {};
  var classes = classifiers[0].classes;
  var topClass = classes[0];
  return topClass;
}


module.exports = classify;
