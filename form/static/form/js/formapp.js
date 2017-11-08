var app = angular.module('formApp', ['ui.bootstrap', 'ngAnimate']);
app.config(function($interpolateProvider, $httpProvider) {
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	$httpProvider.defaults.enctype="multipart/form-data";
});

var slider_dir = 0;

app.factory('Scopes', function ($rootScope) {
	var mem = {};
 
	return {
		store: function (key, value) {
			$rootScope.$emit('scope.stored', key);
			mem[key] = value;
		},
		get: function (key) {
			return mem[key];
		}
	};
});

app.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

app.animation('.slide-animation', function () {
	return {
		addClass: function (element, className, done) {
			var factor = 0;
			if(slider_dir)
				factor = -1;
			else
				factor = 1;
			if (className == 'ng-hide') {
				TweenMax.to(element, 0.2, {left: factor*element.parent().width(), onComplete: done });
			}
			else {
				done();
			}
		},
		removeClass: function (element, className, done) {
			var factor = 0;
			if(slider_dir)
				factor = 1;
			else
				factor = -1;
		    if (className == 'ng-hide') {
				element.removeClass('ng-hide');
				TweenMax.set(element, { left: factor*element.parent().width() });
				TweenMax.to(element, 0.5, {left: 0, onComplete: done });
		}
		else {
			done();
		}
		}
	};
});

app.controller('formCtrl', ['$scope', '$http', '$window', '$timeout', 'Scopes', '$sce',
	
	function ($scope, $http, $window, $timeout, Scopes, $sce) {

		$scope.slider_dir = 0;
		$scope.categories = ['Shopping', 'Food and Ordering', 'Transportation', 'Media and Design', 'Home Services', 'Finance and Money', 'Other'];
		$scope.countries = [{'code': 'DZ', 'name': 'Algeria'},{'code': 'BH', 'name': 'Bahrain'}, {'code': 'EG', 'name': 'Egypt'}, {'code': 'IQ', 'name': 'Iraq'}, {'code': 'JO', 'name': 'Jordan'}, {'code': 'KW', 'name': 'Kuwait'}, {'code': 'LB', 'name': 'Lebanon'}, {'code': 'LY', 'name': 'Libyan Arab Jamahiriya'}, {'code': 'MR', 'name': 'Mauritania'}, {'code': 'MA', 'name': 'Morocco'}, {'code': 'OM', 'name': 'Oman'}, {'code': 'PS', 'name': 'Palestine'},  {'code': 'QA', 'name': 'Qatar'}, {'code': 'SA', 'name': 'Saudi Arabia'}, {'code': 'SD', 'name': 'Sudan'}, {'code': 'SY', 'name': 'Syrian Arab Republic'}, {'code': 'TN', 'name': 'Tunisia'}, {'code': 'UAE', 'name': 'United Arab Emirates'}, {'code': 'YE', 'name': 'Yemen'}];
		$scope.currentIndex = 0;
		$scope.setCurrentSlideIndex = function (index) {
			$scope.currentIndex = index;
		};
		$scope.isCurrentSlideIndex = function (index) {
			return $scope.currentIndex === index;
		};

		$scope.nextSlide = function () {
			slider_dir = 1;
			$scope.slider_dir = 1;
			$scope.currentIndex++;
		};
		$scope.previousSlide = function () {
			slider_dir = 0;
			$scope.slider_dir = 0;
			$scope.currentIndex--;
		};

		$scope.submit_item = function (item_names) {
			$object = {};
			$object_list = {};
			$object['email'] = $scope.email;
			angular.forEach(item_names, function(item_name) {
				item = $scope.$eval(item_name);
				
				$object[item_name] = item;
				$object_list.push(item_name);
			});
			
			$scope.nextSlide();

			
			
			$object['items_list'] = $object_list;
			console.log($object);
			
			//send data to server
			$http.post(site_url+'submit_item/', $object).success(function(data){

			}).error(function(data){
				console.log("ERROR");
			});
		};



}]);