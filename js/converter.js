var app = angular.module('app', ['ngMaterial','ngMessages']);

app.controller('ctrl', [ '$scope','$http', '$window', function($scope,$http,$window){
	

	$scope.historicalDate = $window.historicalDate;
	$scope.dataObj = {};
	$scope.tempArray = [];	
    


	$scope.fromDate = new Date('2017-08-01T03:24:00');
	$scope.fromDateMin = new Date('2017-05-01T03:24:00');
	$scope.fromDateMax = new Date('2017-08-04T03:24:00');

	$scope.toDate = new Date('2017-08-04T03:24:00');
	
	$scope.toDateMax = new Date('2017-08-04T03:24:00');

	$http({
		method: 'GET',
		url: 'http://api.fixer.io/latest?base=EUR'
	}).then(function successCallback(feData) {
		// console.log(feData);
		$scope.dataObj= feData.data.rates;
        $scope.toCountry= $scope.dataObj.INR;
		$scope.fromCountry = $scope.dataObj.USD;
		$scope.fromValue =1;

		$scope.fexConvert();


		$scope.makeGraph();

	}, function errorCallback(error) {
	});

	$scope.fexConvert = function(params){
		$scope.toValue = $scope.fromValue * ($scope.toCountry * (1 / $scope.fromCountry));
		$scope.toValue = $scope.toValue;
		if(params == true){
			$scope.makeGraph();
		}
	};

	


	$scope.makeGraph = function(){
		$scope.tempArray = [];
		$scope.fm = moment($scope.fromDate).format('YYYY-MM-DD');
		$scope.to = moment($scope.toDate).format('YYYY-MM-DD');
		
		$scope.toDateMin = new Date($scope.fromDate);

		angular.forEach(historicalDate, function(obj,date){

			if( (new Date(date).getTime() >= new Date($scope.fm).getTime()) && (new Date(date).getTime() <= new Date($scope.to).getTime()) ){
				$scope.temp = date.split('-');
				$scope.tempArray.push( [Date.UTC($scope.temp[0],$scope.temp[1] - 1,$scope.temp[2]), 1 * (obj.INR * (1 / obj.USD))]);
			}
		});

		Highcharts.chart('container1', {
	        chart: {
	            zoomType: 'x'
	        },
	        title: {
	            text:  'Exchange Rate Over Time'
	        },
	        xAxis: {
	            type: 'datetime',
	            title: {
	                text: 'Time Zone'
	            }
	        },
	        yAxis: {
	            title: {
	                text: 'Exchange rate'
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        plotOptions: {
	            area: {
	                fillColor: {
	                    linearGradient: {
	                        x1: 0,
	                        y1: 0,
	                        x2: 0,
	                        y2: 1
	                    },
	                    stops: [
	                        [0, Highcharts.getOptions().colors[0]],
	                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                    ]
	                },
	                marker: {
	                    radius: 2
	                },
	                lineWidth: 1,
	                states: {
	                    hover: {
	                        lineWidth: 1
	                    }
	                },
	                threshold: null
	            }
	        },
	        series: [{
	            type: 'area',
	            name: 'Conversion',
	            data: $scope.tempArray
	        }]
	    });
	}
}]);
