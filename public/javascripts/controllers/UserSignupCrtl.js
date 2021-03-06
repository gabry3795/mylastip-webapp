angular.module('UserSignupCrtl', []).controller('UserSignupController', function ($scope, $http, $window, $cookies) {
    /**
     * Check if cookie is present, if yes redirect immediately to /members/ and passport
     * will verify if it's true or fake
     */
    if($cookies.get('token')){
        $window.sessionStorage.token = $cookies.get('token');
        $window.location = "/members/";
    }
    
    $scope.message = '';
    $scope.submit = function () {
        $scope.message = 'Loading..';
        if ($scope.user.password != $scope.repeat) {
            $scope.message = "Passwords are different!";
        } else {

            $http
                .post('/api/signup', $scope.user)
                .success(function (data, status, headers, config) {
                    // If response of authentication is positive..
                    if (!data.success) {
                        $scope.message = data.msg;
                    } else {
                        $scope.message = data.msg;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    // Handle signup errors here
                    $scope.message = 'There was an error during the registration process. Please contact the admin.';
                });
        }
    };
});
