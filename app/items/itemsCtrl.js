/**
 * Created by Corey Weber on 2016-07-03.
 */
'use strict';

angular.module('myApp').controller('ItemsCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    console.log("We Are ITEMS");
    $('#createSuccess').hide();

    $scope.setModal = function (item) {
        $scope.modalItem = item;
        console.log($scope.modalItem);
    };
    $scope.setModal2 = function (item) {
        $scope.modalItem2 = item;
        console.log($scope.modalItem);
    };

    $scope.pagination = function(){
        $scope.filteredItems = $scope.items;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;

        $scope.$watch('currentPage + numPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;

            $scope.filteredItems = $scope.items.slice(begin, end);
        });

    };

    
    $scope.getItems = function () {

        $http.get("api/item/getItems.php")
            .then(function (response) {
                if(response.data != '0 results'){
                    $scope.items = response.data;
                    console.log("Response", response.data);
                }else{
                    $scope.items = [];
                    console.log("Length", $scope.items.length);
                }
            });
    };

    $scope.submitForm = function () {
        if ($scope.bid - $scope.items[$index].item_price <= 0) {
            $scope.higherBid = true;
            $scope.userForm.$vaild = false;

        }else if ($scope.userForm.$valid) {
            alert('our form is amazing');
        }

    };

    $scope.closeAlert = function () {
        $scope.showAlert = false;
    };
    
    $scope.getItemIndex = function (itemId) {
        var $index = null;
        var $found = false;
        var $count = 0;
        while (!$found) {
            if (itemId == $scope.items[$count].item_id) {
                $index = $count;
                $count = 0;
                $found = true;
                return $index;
            } else {
                $count++;
            }
        }
        
    };

    $scope.makeBid = function (itemId) {
        //Needed to find index of items array
        var $index = $scope.getItemIndex(itemId);
        $scope.higherBid = false;
        // Error Checking ==> NEEDS WORK ==> Im thinking switch?

        if ($scope.bid - $scope.items[$index].item_price <= 0) {
            $scope.higherBid = true;
            alert("Please Enter a bid that is greater than: " + $scope.items[$index].item_price);

        } else {
            console.log($scope.name);

            $scope.bid = {
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                bid: $scope.bid,
                itemId: itemId

            };

            //$scope.bid = {name: "Corey Weber", email: "Test@Test.com", phone: "90299999999", bid: 1000000, itemId: 1};

            $http({
                url: "api/bid/insertBid.php",
                data: $scope.bid,
                method: 'POST',
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            }).success(function (data) {
                console.log("OK", data);  
                //Show message
                $('#createSuccess').fadeIn('slow');
                setTimeout(function(){
                    $('#createSuccess').fadeOut('slow');
                }, 3000);

                $scope.items[$index].item_price = $scope.bid.bid+".00";
                $scope.higherBid = true;
              
                $scope.clearBid();

            }).error(function (err) {
                console.log(err);
            });
        }
    };

    $scope.clearBid = function () {
        $scope.userForm.$setPristine();
        $scope.name = '';
        $scope.phone = ''; 
        $scope.email = '';
        $scope.bid = '';
    };

    //getAllBids

    //initialize
    $scope.getItems();


}]);