var CombosController,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

CombosController = function($scope, $http, $mdDialog, $mdSidenav, $routeParams, config) {
  var getActivities, getAddons, getCombo, loadProgress, selectedAgeGroups, selectedOccasions, updateImageUrls, uploadFileToUrl;
  $scope.comboId = $routeParams.comboId != null ? $routeParams.comboId : null;
  $scope.users = [];
  $scope.config = config;
  $scope.activities = [];
  $scope.selectedActivities = [];
  $scope.addons = [];
  $scope.selectedAddons = [];
  getAddons = function() {
    var req;
    req = {
      method: "GET",
      url: "/addons/all"
    };
    return $http(req).then(function(response) {
      return $scope.addons = response.data;
    })["catch"](function(error) {
      return console.log("Error in CombosController::getAddons", error);
    });
  };
  getActivities = function() {
    var req;
    req = {
      method: "GET",
      url: "/activities/all"
    };
    return $http(req).then(function(response) {
      return $scope.activities = response.data;
    })["catch"](function(error) {
      return console.log("Error in CombosController::getActivities", error);
    });
  };
  getCombo = function() {
    var req;
    req = {
      method: "GET",
      url: "/combos/" + $scope.comboId
    };
    return $http(req).then(function(response) {
      return $scope.combo = response.data;
    })["catch"](function(error) {
      return console.log("Error in CombosController::getActivities", error);
    });
  };
  $scope.init = function() {
    getActivities();
    getAddons();
    if ($scope.comboId != null) {
      return $scope.getCombo();
    }
  };
  $scope.querySearch = function(criteria) {
    if ((criteria != null ? criteria.length : void 0) > 0) {
      return $scope.addons.filter(function(x) {
        return x.title.indexOf(criteria) < 0;
      });
    } else {
      return [];
    }
  };
  $scope.imageUrls = [];
  $scope.changeSubCategories = function() {
    return $scope.subCategories = subCategories[$scope.searchCategory.value];
  };
  $scope.data = {
    uploadPercentage: 0
  };
  $scope.data.fileName = "";
  loadProgress = function(progress) {
    $scope.$apply(function() {});
    return $scope.data.uploadPercentage = progress;
  };
  if ($scope.activityId == null) {
    $scope.selectedCategory = $scope.categories[0];
    $scope.subCategories = subCategories.experiences;
    $scope.selectedSubCategory = subCategories[$scope.selectedCategory.value][0];
  }
  selectedAgeGroups = [];
  $scope.toggleAgeSelection = function(ageGroup) {
    var index, _ref;
    if (_ref = ageGroup.value, __indexOf.call(selectedAgeGroups, _ref) >= 0) {
      index = selectedAgeGroups.indexOf(ageGroup.value);
      return selectedAgeGroups.splice(index, 1);
    } else {
      return selectedAgeGroups.push(ageGroup.value);
    }
  };
  selectedOccasions = [];
  $scope.toggleOccasionSelection = function(occasion) {
    var index, _ref;
    if (_ref = occasion.value, __indexOf.call(selectedOccasions, _ref) >= 0) {
      index = selectedOccasions.indexOf(occasion.value);
      return selectedOccasions.splice(index, 1);
    } else {
      return selectedOccasions.push(occasion.value);
    }
  };
  $scope.createActivity = function() {
    var data, req;
    data = {
      category: $scope.selectedCategory.value,
      sub_category: $scope.selectedSubCategory.value
    };
    data.title = $scope.title;
    data.description = $scope.description;
    data.add_ons = $scope.selectedAddons.map(function(x) {
      return x._id;
    });
    data.for_whom = selectedAgeGroups;
    data.occasion = selectedOccasions;
    req = {
      url: "/activities/add",
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
        "Accpet": "application/json"
      }
    };
    return $http(req).then(function(response) {
      $scope.activityCreated = true;
      return $scope.activityId = response.data.activityId;
    });
  };
  $scope.uploadImage = function() {
    var activityId, file, files, req;
    activityId = $scope.activityId;
    files = document.getElementById("inputFile").files;
    file = files[0];
    if (file != null) {
      if (activityId != null) {
        req = {
          url: "activities/upload-url",
          method: "POST",
          data: {
            activityId: activityId,
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
  updateImageUrls = function(imageUrl) {
    var req;
    req = {
      "method": "PATCH",
      url: "/activities/activity/" + $scope.activityId
    };
    req.data = {
      image_urls: $scope.imageUrls
    };
    return $http(req).then(function(response) {
      return console.log($scope.activityId + " updated");
    })["catch"](function(error) {
      return console.log("Error in update activity: ", error);
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
  $scope.getAllActivities = function() {
    var req;
    req = {
      method: "GET",
      url: "/activities/all"
    };
    return $http(req).then(function(response) {
      return $scope.allActivities = response.data;
    })["catch"](function(response) {
      console.log(response);
      return alert("Error occurred in get all activities");
    });
  };
  $scope.searchActivities = function() {};
  return $scope.getActivity = function() {
    var req;
    if (($routeParams != null ? $routeParams.activityId : void 0) != null) {
      req = {
        method: "GET",
        url: "activities/activity/" + $routeParams.activityId
      };
      return $http(req).then(function(response) {
        var add_ons, category, description, for_whom, image_urls, mCategories, occasion, sSubCategories, sub_category, title, _ref;
        _ref = response.data, title = _ref.title, description = _ref.description, category = _ref.category, sub_category = _ref.sub_category, add_ons = _ref.add_ons, occasion = _ref.occasion, for_whom = _ref.for_whom, image_urls = _ref.image_urls;
        $scope.title = title;
        $scope.description = description;
        mCategories = $scope.categories.filter(function(x) {
          return x.value === category;
        });
        $scope.selectedCategory = mCategories[0];
        sSubCategories = subCategories[category].filter(function(x) {
          return x.value === sub_category;
        });
        $scope.subCategories = subCategories[category];
        $scope.selectedSubCategory = sSubCategories[0];
        $scope.ageGroups.map(function(x) {
          var _ref1;
          return x.selected = (_ref1 = x.value, __indexOf.call(for_whom, _ref1) >= 0) ? true : false;
        });
        $scope.occasions.map(function(x) {
          var _ref1;
          return x.selected = (_ref1 = x.value, __indexOf.call(occasion, _ref1) >= 0) ? true : false;
        });
        $scope.selectedAddons = $scope.addons.filter(function(x) {
          var _ref1;
          return _ref1 = x._id, __indexOf.call(add_ons, _ref1) >= 0;
        });
        if ((image_urls != null ? image_urls.length : void 0) > 0) {
          return $scope.imageUrls = image_urls;
        }
      })["catch"](function(error) {
        console.log("Error in get Activity:", error);
        return alert("Error in get activity");
      });
    } else {
      return alert("Activity id not defined");
    }
  };
};

CombosController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav", "$routeParams", "config"];

app.controller('CombosController', CombosController);
