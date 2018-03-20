var GiftsController,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

GiftsController = function($scope, $http, $mdDialog, $mdSidenav, $routeParams, config) {
  var CATEGORIES, TAGS, loadProgress, updateDefault, updateImageUrls, uploadFileToUrl;
  $scope.giftId = $routeParams.giftId != null ? $routeParams.giftId : null;
  $scope.users = [];
  $scope.config = config;
  TAGS = [
    {
      name: "Birthday",
      value: "birthday"
    }, {
      name: "Romantic",
      value: "romantic"
    }, {
      name: "Anniversary",
      value: "anniversary"
    }
  ];
  CATEGORIES = [
    {
      name: "Crafts of Love",
      value: "crafts-of-love"
    }, {
      name: "Gift A Life",
      value: "gift-a-life"
    }, {
      name: "Personalised",
      value: "personalised"
    }, {
      name: "Seasonal",
      value: "seasonal"
    }
  ];
  $scope.selectedTags = [];
  $scope.filterSelected = true;
  $scope.init = function() {
    $scope.tags = "";
    $scope.getAllGifts();
    $scope.categories = CATEGORIES;
    if ($scope.giftId != null) {
      return $scope.getGift();
    }
  };
  $scope.querySearch = function(criteria) {
    if ((criteria != null ? criteria.length : void 0) > 0) {
      criteria = criteria.toLowerCase();
      return $scope.tags.filter(function(x) {
        return x.value.indexOf(criteria) >= 0;
      });
    } else {
      return [];
    }
  };
  $scope.imageUrls = [];
  $scope.data = {
    uploadPercentage: 0
  };
  $scope.data.fileName = "";
  $scope.defaultImageIndex = 0;
  loadProgress = function(progress) {
    $scope.$apply(function() {});
    return $scope.data.uploadPercentage = progress;
  };
  $scope.saveGift = function() {
    var data, req;
    data = {};
    data.title = $scope.title;
    data.price = $scope.price;
    data.category = $scope.selectedCategory.value;
    data.description = $scope.description;
    data.tags = $scope.tags;
    data.seo_keywords = $scope.seo_keywords;
    req = {};
    if ($scope.giftId != null) {
      req.url = "/gifts/gift/" + $scope.giftId;
      req.method = "PATCH";
    } else {
      req.url = "/gifts/add";
      req.method = "POST";
    }
    req.data = data;
    req.headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    return $http(req).then(function(response) {
      if ($scope.giftId == null) {
        $scope.giftCreated = true;
        return $scope.giftId = response.data.giftId;
      }
    })["catch"](function(error) {
      return console.log("Error occurred in gift update: ", error);
    });
  };
  $scope.uploadImage = function() {
    var file, files, giftId, req;
    giftId = $scope.giftId;
    files = document.getElementById("inputFile").files;
    file = files[0];
    if (file != null) {
      if (giftId != null) {
        req = {
          url: "gifts/upload-url",
          method: "POST",
          data: {
            giftId: giftId,
            contentType: file.type
          }
        };
        return $http(req).then(function(response) {
          console.log(response.data.url);
          uploadFileToUrl(response.data.url);
          response.data.uploaded = false;
          return $scope.imageUrls.push(response.data.filename);
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
  updateDefault = function() {
    var imageIndex, imageUrl, image_urls, _i, _len, _ref;
    imageIndex = parseInt($scope.defaultImageIndex);
    console.log("imageIndex: ", imageIndex);
    image_urls = $scope.imageUrls.length > 0 ? [$scope.imageUrls[imageIndex]] : [];
    _ref = $scope.imageUrls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imageUrl = _ref[_i];
      if (__indexOf.call(image_urls, imageUrl) < 0) {
        image_urls.push(imageUrl);
      }
    }
    return image_urls;
  };
  $scope.changeDefault = function() {
    return updateImageUrls();
  };
  $scope.removeImageUrl = function(index) {
    console.log("index: ", index);
    console.log("imageUrls:", $scope.imageUrls);
    $scope.imageUrls.splice(index, 1);
    console.log("imageUrls: ", $scope.imageUrls);
    return updateImageUrls();
  };
  updateImageUrls = function(imageUrl) {
    var image_urls, req;
    req = {
      "method": "PATCH",
      url: "/gifts/gift/" + $scope.giftId
    };
    image_urls = updateDefault();
    req.data = {
      image_urls: image_urls
    };
    return $http(req).then(function(response) {
      return console.log($scope.giftId + " updated");
    })["catch"](function(error) {
      return console.log("Error in update gift: ", error);
    });
  };
  uploadFileToUrl = function(url) {
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
        return updateImageUrls();
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
  $scope.getAllGifts = function() {
    var req;
    req = {
      method: "GET",
      url: "/gifts/all"
    };
    return $http(req).then(function(response) {
      return $scope.allGifts = response.data;
    })["catch"](function(response) {
      console.log(response);
      return alert("Error occurred in get all gifts");
    });
  };
  $scope.searchGifts = function() {};
  return $scope.getGift = function() {
    var req;
    if (($routeParams != null ? $routeParams.giftId : void 0) != null) {
      req = {
        method: "GET",
        url: "gifts/gift/" + $routeParams.giftId
      };
      return $http(req).then(function(response) {
        var category, description, display_title, filteredCategories, image_urls, price, seo_keywords, tags, title, _ref;
        _ref = response.data, title = _ref.title, description = _ref.description, price = _ref.price, tags = _ref.tags, image_urls = _ref.image_urls, category = _ref.category, display_title = _ref.display_title, seo_keywords = _ref.seo_keywords;
        seo_keywords = response.data.seo_keywords;
        $scope.title = title;
        $scope.display_title = display_title;
        $scope.description = description;
        $scope.price = price;
        $scope.seo_keywords = seo_keywords;
        if (category == null) {
          category = "";
        }
        filteredCategories = $scope.categories.filter(function(x) {
          return x.value === category;
        });
        $scope.selectedCategory = filteredCategories[0];
        $scope.tags = tags;
        if ((image_urls != null ? image_urls.length : void 0) > 0) {
          $scope.imageUrls = image_urls;
        }
        return $scope.mainUrl = image_urls[0];
      })["catch"](function(error) {
        console.log("Error in get Gift:", error);
        return alert("Error in get gift");
      });
    } else {
      return alert("Gift id not defined");
    }
  };
};

GiftsController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav", "$routeParams", "config"];

app.controller('GiftsController', GiftsController);
