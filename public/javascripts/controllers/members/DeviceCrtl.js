angular.module('DeviceCtrl', []).controller('DeviceController', function ($scope, $routeParams, $http, $window) {
    //$scope.tagline = 'MyLastIPtestmain';
    var ID = $routeParams.id;
    var device;

    /**
     * This function loads device info and updates the view
     */
    $scope.load = function () {
        $http
            .post('/api/get_device_info', {id: ID})
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.message = "Device does not exist.";
                else {
                    // Get the device from response
                    device = data.device;
                    // Assign device variable to scope
                    $scope.device = device;
                    $scope.registered = device.registered_on; // TODO use angular-moment to convert
                    if (device.logdata.length == 0) {
                        // Update view
                        $scope.ip_container = {display: 'none'};
                        $scope.last_data_container = {display: 'none'};
                        $scope.message = "No log data for this device yet.";
                    } else {
                        // Update view
                        $scope.device.uname = device.uname.replace(/#/g," ");
                        $scope.ip_container = {display: 'block'};
                        $scope.last_data_container = {display: 'block'};
                        $scope.logdata = device.logdata;
                        var entries_string = device.logdata.length == 1 ? " entry for this device" : " entries for this device";
                        $scope.message = device.logdata.length + entries_string;
                        //if (device.logdata.length == 1) $scope.message = device.logdata.length + " entry for this device";
                        //else $scope.message = device.logdata.length + " entries for this device";
                    }
                }
            })
            .error(function (data, status, headers, config) {
                $scope.message = "There was an error getting the data #070#" + status + " :( Please send this to the admin!";
            })
    };
    $scope.load();

    /**
     * This function calls the api that will clear the log for current device, from id. Then it will reload the table
     */
    $scope.clearLog = function () {
        $http
            .post('/api/remove_all_logdata', {id: device._id})
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.message = "Device does not exist.";
                else {
                    $scope.logdata = {};
                    $scope.load();
                }
            });
    };

    /**
     * This function calls the api that generates the settings.json to download
     */
    $scope.generateSettingsFile = function () {
        var settings_json = {
            "server": "http://" + $window.location.host,
            "key": device.key,
            "delay": 900
        };
        var blob = new Blob([angular.toJson(settings_json)], {type: "application/json;charset=utf-8;"});
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'settings.json');
        downloadLink[0].click();
    }

});