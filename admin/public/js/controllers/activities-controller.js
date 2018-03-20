var ActivitiesController,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

ActivitiesController = function($scope, $http, $mdDialog, $mdSidenav, $routeParams, config) {
  var clearFields, loadProgress, searchAddons, selectedAgeGroups, selectedOccasions, subCategories, updateDefault, updateImageUrls, uploadFileToUrl;
  $scope.activityId = $routeParams.activityId != null ? $routeParams.activityId : null;
  $scope.users = [];
  $scope.config = config;
  $scope.categories = [
    {
      name: "Experiences",
      value: "experiences"
    }, {
      name: "Candle Light Dinners",
      value: "candle-light-dinners"
    }
  ];
  subCategories = {
    "candle-light-dinners": [
      {
        name: "Royale",
        value: "royale"
      }, {
        name: "Standard",
        value: "standard"
      }, {
        name: "Pool Side",
        value: "pool-side"
      }, {
        name: "Beach Side",
        value: "beach-side"
      }, {
        name: "Nature Side",
        value: "nature-side"
      }
    ],
    "experiences": [
      {
        name: "Romantic",
        value: "romantic"
      }, {
        name: "Adventurous",
        value: "adventurous"
      }, {
        name: "Fun",
        value: "fun"
      }, {
        name: "Heart Warming",
        value: "heart-warming"
      }
    ]
  };
  $scope.ageGroups = [
    {
      name: "Kids",
      value: "kids",
      selected: false
    }, {
      name: "Parents",
      value: "parents",
      selected: false
    }, {
      name: "Friends",
      value: "friends",
      selected: false
    }, {
      name: "Couples",
      value: "couples",
      selected: false
    }, {
      name: "Him",
      value: "him",
      selected: false
    }, {
      name: "Her",
      value: "her",
      selected: false
    }
  ];
  $scope.occasions = [
    {
      name: "Birthday",
      value: "birthday",
      selected: false
    }, {
      name: "Wedding",
      value: "wedding",
      selected: false
    }, {
      name: "Anniversary",
      value: "anniversary",
      selected: false
    }, {
      name: "Proposal",
      value: "proposal",
      selected: false
    }, {
      name: "New Born",
      value: "new-born",
      selected: false
    }, {
      name: "Shashtipoorthi",
      value: "shashtipoorthi",
      selected: false
    }, {
      name: "Get Together",
      value: "get-together",
      selected: false
    }
  ];
  $scope.addons = [];
  $scope.selectedAddons = [];
  $scope.filterSelected = true;
  $scope.defaultImageIndex = 0;
  $scope.init = function() {
    var req;
    req = {
      method: "GET",
      url: "/addons/all"
    };
    return $http(req).then(function(response) {
      $scope.addons = response.data;
      if ($scope.activityId != null) {
        return $scope.getActivity();
      }
    })["catch"](function(error) {
      return console.log("Error in ActivitiesController: init", error);
    });
  };
  searchAddons = function(criteria) {
    var req;
    req = {
      method: "GET",
      url: "/addons/search?q=" + criteria
    };
    return $http(req).then(function(response) {
      return response.data;
    })["catch"](function(error) {
      return console.log("Error in searchAddons: ", error);
    });
  };
  $scope.querySearch = function(criteria) {
    if ((criteria != null ? criteria.length : void 0) > 0) {
      return searchAddons(criteria);
    } else {
      return [];
    }
  };
  $scope.imageUrls = [];
  $scope.changeSubCategories = function() {
    return $scope.subCategories = subCategories[$scope.selectedCategory.value];
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
  clearFields = function() {
    $scope.title = "";
    $scope.notes = "";
    $scope.description = "";
    $scope.tags = "";
    $scope.title = "";
    $scope.price = "";
    $scope.seo_keywords = "";
    $scope.selectedAddons = [];
    selectedAgeGroups = [];
    selectedOccasions = [];
    $scope.ageGroups = $scope.ageGroups.map(function(x) {
      x.selected = false;
      return x;
    });
    return $scope.occasions = $scope.occasions.map(function(x) {
      x.selected = false;
      return x;
    });
  };
  $scope.createActivity = function() {
    var data, req;
    data = {
      category: $scope.selectedCategory.value,
      sub_category: $scope.selectedSubCategory.value
    };
    data.title = $scope.title;
    data.tags = $scope.tags;
    data.seo_keywords = $scope.seo_keywords;
    data.notes = $scope.notes;
    data.price = $scope.price;
    data.description = $scope.description;
    data.addons = $scope.selectedAddons.map(function(x) {
      return x._id;
    });
    data.for_whom = selectedAgeGroups;
    data.occasions = selectedOccasions;
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
      $scope.activityId = response.data.activityId;
      clearFields();
      return alert("activity added");
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
  updateDefault = function() {
    var imageIndex, imageUrl, image_urls, _i, _len, _ref;
    imageIndex = parseInt($scope.defaultImageIndex);
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
  updateImageUrls = function() {
    var image_urls, req;
    req = {
      "method": "PATCH",
      url: "/activities/activity/" + $scope.activityId
    };
    image_urls = updateDefault();
    req.data = {
      image_urls: image_urls
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
    xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    $scope.data.uploadPercentage = 0;
    xhr.onload = function() {
      if (this.status === 200) {
        alert("file uploaded");
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
  $scope.getActivity = function() {
    var req;
    if (($routeParams != null ? $routeParams.activityId : void 0) != null) {
      req = {
        method: "GET",
        url: "activities/activity/" + $routeParams.activityId
      };
      return $http(req).then(function(response) {
        var addons, category, description, display_title, for_whom, image_urls, mCategories, notes, occasions, price, sSubCategories, seo_keywords, sub_category, tags, title, _ref;
        _ref = response.data, title = _ref.title, display_title = _ref.display_title, price = _ref.price, description = _ref.description, category = _ref.category, sub_category = _ref.sub_category, addons = _ref.addons, occasions = _ref.occasions, for_whom = _ref.for_whom, image_urls = _ref.image_urls, notes = _ref.notes, seo_keywords = _ref.seo_keywords, tags = _ref.tags;
        $scope.title = title;
        $scope.price = price;
        $scope.display_title = display_title;
        $scope.description = description;
        mCategories = $scope.categories.filter(function(x) {
          return x.value === category;
        });
        $scope.selectedCategory = mCategories[0];
        console.log("category: ", category);
        sSubCategories = subCategories[category].filter(function(x) {
          return x.value === sub_category;
        });
        console.log("sub categories: ", sSubCategories);
        $scope.subCategories = subCategories[category];
        $scope.selectedSubCategory = sSubCategories[0];
        $scope.notes = notes;
        $scope.seo_keywords = seo_keywords;
        $scope.tags = tags;
        if (for_whom == null) {
          for_whom = [];
        }
        if (occasions == null) {
          occasions = [];
        }
        selectedAgeGroups = for_whom;
        selectedOccasions = occasions;
        $scope.ageGroups.map(function(x) {
          var _ref1;
          console.log("x: ", x);
          return x.selected = (_ref1 = x.value, __indexOf.call(for_whom, _ref1) >= 0) ? true : false;
        });
        $scope.occasions.map(function(x) {
          var _ref1;
          return x.selected = (_ref1 = x.value, __indexOf.call(occasions, _ref1) >= 0) ? true : false;
        });
        $scope.selectedAddons = $scope.addons.filter(function(x) {
          var _ref1;
          return _ref1 = x._id, __indexOf.call(addons, _ref1) >= 0;
        });
        if ((image_urls != null ? image_urls.length : void 0) > 0) {
          $scope.imageUrls = image_urls;
        }
        return $scope.mainUrl = image_urls[0];
      })["catch"](function(error) {
        console.log("Error in get Activity:", error);
        return alert("Error in get activity");
      });
    } else {
      return alert("Activity id not defined");
    }
  };
  $scope.saveActivity = function() {
    var addons, category, data, description, for_whom, image_urls, notes, occasions, req, seo_keywords, tags, title;
    req = {
      method: "PATCH",
      url: "activities/activity/" + $routeParams.activityId
    };
    title = $scope.title, description = $scope.description, category = $scope.category, addons = $scope.addons, occasions = $scope.occasions, for_whom = $scope.for_whom, image_urls = $scope.image_urls, notes = $scope.notes, seo_keywords = $scope.seo_keywords, tags = $scope.tags;
    data = {
      title: title,
      description: description,
      addons: addons,
      occasions: occasions,
      for_whom: for_whom,
      image_urls: image_urls,
      notes: notes,
      seo_keywords: seo_keywords,
      tags: tags
    };
    data.addons = $scope.selectedAddons.map(function(x) {
      return x._id;
    });
    data.for_whom = selectedAgeGroups;
    data.occasions = selectedOccasions;
    data.category = $scope.selectedCategory.value;
    data.sub_category = $scope.selectedSubCategory.value;
    req.data = data;
    return $http(req).then(function(response) {
      console.log("Activity updated: " + $routeParams.activityId);
      return alert("activity added");
    })["catch"](function(error) {
      console.log("Error in get Activity:", error);
      return alert("Error in get activity");
    });
  };
  return $scope.changeMainUrl = function(index) {
    return $scope.mainUrl = $scope.imageUrls[index];
  };
};

ActivitiesController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav", "$routeParams", "config"];

app.controller('ActivitiesController', ActivitiesController);
