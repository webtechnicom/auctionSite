/**
 * Created by Corey Weber on 2016-07-03.
 */
'use strict';

angular.module('myApp').controller('AdminCtrl', ['JWT', 'GetItems', '$scope', '$http', '$timeout', function (JWT, GetItems, $scope, $http, $timeout) {

    console.log("We Are Admin");


    $('#createSuccess').hide();
    $('#editSuccess').hide();



    var fileInput = document.getElementById('file');


    fileInput.addEventListener('change', function (e) {

        var file = fileInput.files[0];
        var imageType = /image.*/;
        
            if (file.type.match(imageType)) {

                var reader = new FileReader();

                reader.onload = function () {
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');


                    // create a new image from user selected file
                    var img = new Image();
                    img.onload = function () {
                        // set canvas size to image size
                        canvas.width = 350;
                        canvas.height = 350;

                        // scale and draw image with offset
                        ctx.drawImage(img, 0, 0, 350, 350);
                        $scope.picture = canvas.toDataURL('image/jpeg', 0.4);
                    };
                    img.src = reader.result;

                };
                reader.readAsDataURL(file);
            } else {
                alert("Please submit an image!");
                
            }

    });
    



    $scope.makeItem = function () {
        
        if($scope.picture === '' || $scope.picture === undefined || $scope.picture === null){
            alert("Please enter a valid picture!");
        }else {
            $scope.loading = true;

            $scope.item = {
                name: $scope.name,
                price: $scope.price,
                image: $scope.picture,
                description: $scope.description,
                currentBidder: "No High Bidder"
            };
            console.log($scope.item);

            $http({
                url: "api/item/insertItem.php",
                data: $scope.item,
                method: 'POST',
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            }).success(function (data) {

                console.log(data);
                //Show message
                $('#createSuccess').fadeIn('slow');
                setTimeout(function () {
                    $('#createSuccess').fadeOut('slow');
                }, 3000);
                $scope.loading = false;
                $scope.clearBid();

                $scope.items.push(data[0]);

                $scope.itemCreate = true;
            }).error(function (err) {
                console.log("err");
            });
        }
    };


    $scope.editItem = function (item) {

        $http({
            url: "api/item/updateItem.php",
            data: item,
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (data) {
            console.log(data);
            //Show message
            $('#editSuccess').fadeIn('slow');
            setTimeout(function () {
                $('#editSuccess').fadeOut('slow');
            }, 3000);
            $scope.itemEdit = true;
        }).error(function (err) {

        });
        $scope.itemEdit = false;

    };

    $scope.setModal = function (item) {
        $scope.modalItem = item;


    };


    $scope.deleteItem = function (item) {


        $http({
            url: "api/item/deleteItem.php",
            data: item.item_id,
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (data) {


            $scope.items.splice($scope.items.indexOf(item), 1);
        }).error(function (err) {

        });
    };

    $scope.deleteAllItems = function () {


        $http({
            url: "api/item/deleteAllItems.php",
            method: 'POST',
        }).success(function (data) {

            $scope.items.splice($scope.items);
        }).error(function (err) {

        });
    };


    $scope.setModal2 = function (bidId) {


        if (bidId != '0' && bidId != 0 && bidId != null) {

            $http({
                url: "api/bid/getHighestBid.php",
                data: bidId,
                method: 'POST',
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            }).success(function (data) {
                $scope.isBid = true;


                $scope.modalItem2 = data[0];


                //open modal with data

            }).error(function (err) {


                //error
            });

        } else {
            //no bid error
            $scope.isBid = false;
        }
    };

    $scope.clearBid = function () {

        $scope.userForm.$setPristine();
        $scope.name = '';
        $scope.price = '';
        $scope.picture = '';
        $scope.description = '';
        $scope.file='';
    };

    $scope.getItems = function () {

        GetItems.async().then(function (data) {
            $scope.items = data[0];
            $scope.totalItems = data[1];
        });
    };
  
    $scope.getItems();

}]);