var AddonsController;

AddonsController = function($scope, $http, $mdDialog, $mdSidenav, $mdToast, config) {
  var getAllAddons, loadProgress, updateImageUrl, uploadFileToUrl;
  $scope.addons = [];
  $scope.data = {};
  $scope.config = config;
  $scope.saveAddon = function() {
    var data, description, display_name, image_url, price, req, title;
    title = $scope.title, description = $scope.description, price = $scope.price, image_url = $scope.image_url, display_name = $scope.display_name;
    data = {
      title: title,
      description: description,
      price: price,
      image_url: image_url,
      display_name: display_name
    };
    req = {
      url: "/addons/add",
      method: "POST",
      data: data
    };
    return $http(req).then(function(response) {
      return $mdToast.show($mdToast.simple({
        position: "top"
      }).content(response.data.message));
    })["catch"](function(error) {
      return $mdToast.show($mdToast.simple({
        position: "top"
      }).content(error.data.message));
    });
  };
  getAllAddons = function() {
    var req;
    req = {
      url: "/addons/all",
      method: "GET"
    };
    return $http(req).then(function(response) {
      return $scope.addons = response.data;
    })["catch"](function(error) {
      var message;
      message = "";
      return $mdToast.show($mdToast.simple({
        position: "top"
      }).content(error.data.message));
    });
  };
  $scope.init = function() {
    return getAllAddons();
  };
  $scope.updateAddon = function(index) {
    var addon, req;
    addon = $scope.addons[index];
    req = {
      url: "/addons/addon/" + addon._id,
      method: "PATCH",
      data: addon
    };
    return $http(req).then(function(response) {
      return $mdToast.show($mdToast.simple({
        position: "top"
      }).content(response.data.message));
    })["catch"](function(error) {
      var message;
      message = "";
      return $mdToast.show($mdToast.simple({
        position: "top"
      }).content(error.data.message));
    });
  };
  $scope.uploadImage = function(addon) {
    var addonId, file, files, req;
    addonId = addon._id;
    files = document.getElementById("inputFile").files;
    file = files[0];
    if (file != null) {
      if (addonId != null) {
        req = {
          url: "addons/upload-url",
          method: "POST",
          data: {
            addonId: addonId,
            contentType: file.type
          }
        };
        return $http(req).then(function(response) {
          addon.image_url = response.data.filename;
          return uploadFileToUrl(addon, response.data.url);
        })["catch"](function(error) {
          return console.log("Error in upload url generate: ", error);
        });
      } else {
        return alert("Please create the activity first");
      }
    } else {
      return alert("Please select a file");
    }
  };
  loadProgress = function(progress) {
    return $scope.$apply(function() {
      return $scope.data.uploadPercentage = progress;
    });
  };
  updateImageUrl = function(addon) {
    var req;
    req = {
      "method": "PATCH",
      url: "/addons/addon/" + addon._id
    };
    req.data = {
      image_url: addon.image_url
    };
    return $http(req).then(function(response) {
      return console.log(addon._id + " updated");
    })["catch"](function(error) {
      return console.log("Error in update activity: ", error);
    });
  };
  return uploadFileToUrl = function(addon, url) {
    var file, files, headers, k, v, xhr;
    files = document.getElementById("inputFile").files;
    file = files[0];
    console.log("file", file);
    xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    $scope.data.uploadPercentage = 0;
    xhr.onload = function() {
      if (this.status === 200) {
        console.log("file uploaded:");
        return updateImageUrl(addon);
      }
    };
    xhr.onerror = function(error) {
      return console.log("Error: ", error);
    };
    headers = {
      "Content-Type": "" + file.type,
      "cache": false,
      "processData": false,
      "Cache-Control": "no-cache"
    };
    for (k in headers) {
      v = headers[k];
      xhr.setRequestHeader(k, v);
    }
    return xhr.send(file);
  };
};

AddonsController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav", "$mdToast", "config"];

app.controller('AddonsController', AddonsController);
