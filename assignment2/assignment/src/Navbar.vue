<template id="navBar">
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
<!--      <b-navbar-brand href="#">Home</b-navbar-brand>-->
      <div class="ml-auto">
        <router-link :to = "{ name: 'home'}" ><b-button > Home </b-button> </router-link>
        <router-link :to = "{ name: 'venues'}" ><b-button> Browse Venues </b-button> </router-link>
      </div>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav right>
            <router-link :to = "{ name: 'portfolio'}" ><b-button> Visit My Portfolio </b-button> </router-link>
          </b-navbar-nav>
          <b-navbar-nav right v-if="this.$cookie.get('authToken')">
            <b-nav-item :to = "{ name: 'user', params: { id: this.$cookie.get('userId')}}" v-if="this.$cookie.get('authToken')">View Profile</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="this.$cookie.get('authToken')">
            <b-nav-item  v-b-modal="'create-venue-modal'" >Create Venue</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="this.$cookie.get('authToken')">
            <b-nav-item :to = "{ name: 'userVenues'}">My Venues</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="!this.$cookie.get('authToken')">
            <b-nav-item href="#" v-b-modal="'register-modal'">Register</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="!this.$cookie.get('authToken')">
            <b-nav-item href="#" v-b-modal="'login-modal'" >Login</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="this.$cookie.get('authToken')">
            <b-nav-item href="#"  @click="logoutUser">Sign out</b-nav-item>
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal  id="register-modal" size="xl" title="Register" hide-footer>
      <b-form  @submit.stop.prevent="registerUser">
        <b-card bg-variant="light" class="m-4 p-2">

          <b-form-group
            horizontal
            id="input-group-1"
            label="Given Name:"
          >
            <b-form-input required type="text" v-model="givenName" ></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            id="input-group-2"
            label="Family Name:"
            label-for="input-1"
          >
            <b-form-input required type="text" v-model="familyName"  inline></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            id="input-group-3"
            label="Email address:"
            label-for="input-3"
            required
          >
            <b-form-input v-model="email" type="email" inline required></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            id="input-group-4"
            label="Username:"
            label-for="input-4"
          >
            <b-form-input :state="validation" type="text" v-model="username" inline required></b-form-input>
          </b-form-group>
          <b-form-invalid-feedback :state="validation">
            <strong>{{error}}</strong>
          </b-form-invalid-feedback>

          <b-form-group horizontal label="Password:" id="input-group-5" description="We'll never share your password with anyone else.">
            <b-form-input v-model="password" type="password" inline required></b-form-input>
          </b-form-group>

          <b-form-group horizontal label="Confirm Password:" id="input-group-6">
            <b-form-input v-model="confirmPassword" type="password" inline required :state="passwordValidation"></b-form-input>
          </b-form-group>

          <b-btn style="float: right" variant="primary" type="submit" data-dismiss="modal@click=" >Register</b-btn>
<!--          @click="$bvModal.hide('register-modal')"-->

          <b-form-invalid-feedback :state="passwordValidation">
            <strong>{{passwordError}}</strong>
          </b-form-invalid-feedback>
          <div v-if="errorFlag" style="color: red;">
            <strong>{{userNameOrEmailError}}</strong>
          </div>
        </b-card>
      </b-form>
    </b-modal>

    <b-modal  id="login-modal" size="xl" title="Login" hide-footer>
      <b-form @submit.stop.prevent="loginUser">
        <b-card bg-variant="light" class="m-4 p-2">

          <b-form-group
            horizontal
            label="Email address:"
            label-for="input-3"
            required
          >
            <b-form-input v-model="email" type="email" inline ></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            label="Username:"
            label-for="input-4"
          >
            <b-form-input type="text" v-model="username" inline required></b-form-input>
          </b-form-group>

          <b-form-invalid-feedback >
            <strong>{{error}}</strong>
          </b-form-invalid-feedback>

          <b-form-group horizontal label="Password:" description="We'll never share your password with anyone else.">
            <b-form-input v-model="password" type="password" inline required></b-form-input>
          </b-form-group>

          <b-button style="float: right" variant="primary" type="submit" >Login</b-button>
          <!--          @click="$bvModal.hide('register-modal')"-->

        </b-card>
        <div v-if="loginErrorFlag" style="color: red;">
          <strong>Invalid username or email entered. Please try again</strong>
        </div>
      </b-form>
    </b-modal>

    <b-modal  id="create-venue-modal" size="xl" title="Create A Venue" hide-footer>
      <b-form  @submit.stop.prevent="createVenue">
        <b-card bg-variant="light" class="m-4 p-2">

          <b-form-group
            horizontal
            label="Venue Name:"
          >
            <b-form-input required type="text" v-model="venueName" ></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            label="Category Type:"
          >
            <b-form-select type="number" v-model="optionSelected" :options="options"></b-form-select>
          </b-form-group>

          <b-form-group
            horizontal
            label="Short Description:"
            required
          >
            <b-form-input v-model="shortDescription"  inline required></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            label="Long Description:"
          >
            <b-form-input  type="text" v-model="longDescription" inline required></b-form-input>
          </b-form-group>
          <b-form-invalid-feedback :state="validation">
            <strong>{{error}}</strong>
          </b-form-invalid-feedback>

          <b-form-group
            horizontal
            label="City:"
          >
            <b-form-input required type="text" v-model="venueCity"  inline></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            label="Address:"
          >
            <b-form-input required type="text" v-model="address"  inline></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            label="Latitude:"
          >
            <b-form-input required type="number" v-model="latitude"  inline></b-form-input>
          </b-form-group>

          <b-form-group
            horizontal
            label="Longitude:"
          >
            <b-form-input required type="number" v-model="longitude"  inline></b-form-input>
          </b-form-group>

          <b-btn style="float: right" variant="primary" type="submit" data-dismiss="modal@click=" >Create Venue</b-btn>
          <!--          @click="$bvModal.hide('register-modal')"-->

          <b-form-invalid-feedback >
            <strong>{{passwordError}}</strong>
          </b-form-invalid-feedback>
          <div v-if="errorFlag" style="color: red;">
            <strong>{{userNameOrEmailError}}</strong>
          </div>
        </b-card>
      </b-form>
    </b-modal>
  </div>

</template>
<script>
  import * as router from "vue";

  export default {
    name: "navBar",
    data() {
      return {
        venueName : "",
        shortDescription : "",
        longDescription : "",
        venueCity : "",
        address : "",
        latitude : 0,
        longitude : 0,
        optionSelected : 0,
        options: [
          {value: 1, text: 'Accommodation'},
          {value: 2, text: 'Cafés & Restaurants'},
          {value: 3, text: 'Attractions'},
          {value: 4, text: 'Events'},
          {value: 5, text: 'Nature Spots'}
        ],
        error : "",
        passwordError : "",
        userNameOrEmailError : "",
        errorFlag : false,
        loginErrorFlag : false,
        givenName : "",
        familyName : "",
        email : "",
        username : "",
        password : "",
        confirmPassword : "",

        id : "",
        token : ""
      }
    },
    methods: {
      createVenue : function () {

        this.$http.post('http://68.183.162.185:4941/api/v1/venues', JSON.stringify({
          venueName: this.venueName,
          categoryId: this.optionSelected,
          city: this.venueCity,
          shortDescription: this.shortDescription,
          longDescription: this.longDescription,
          address: this.address,
          latitude: parseInt(this.latitude),
          longitude: parseInt(this.longitude),
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          // alert("here1")
          // alert(JSON.stringify(response))
          location.reload();
          this.$router.push({name : "userVenues"})

        })
      },
      // hideLoginModal(){
      //   this.$root.$emit('bv::hide::modal', 'login-modal', '#btnShow')
      // },
      logoutUser : function() {
        this.$http.post('http://127.0.0.1:4941/api/v1/users/logout', {}, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then( (res) => {
          this.$cookie.delete("userId");
          this.$cookie.delete("authToken");
          location.reload();
          console.log(res)
        }
        );

      },
      registerUser : function() {

        // if (!this.validation() && !this.passwordValidation()) {return;}


        // alert(this.count)
        if (this.validation && this.passwordValidation) {
          this.$http.post('http://68.183.162.185:4941/api/v1/users', JSON.stringify({
            givenName: this.givenName,
            familyName: this.familyName,
            email: this.email,
            username: this.username,
            password: this.password,
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            // this.$router.push({name: 'venues'});
            // alert(this.password)

            //
            //
            // alert(JSON.stringify(response))
          }, function (error) {
            // alert(JSON.stringify(error));
            if (error.status !== 200) {
              this.errorFlag = true;
              this.userNameOrEmailError = error.statusText.substring(13);
            }
            // alert(this.userNameOrEmailError);

          }).then(function () {
            // alert(this.username + this.email + this.password)
            this.loginUser();
          })

        } else {alert("Incorrect credentials. Please try again.")}
      },
      loginUser : function () {
        // this.count++;
        // alert(this.count)
        // alert("im here boi")
        // alert(this.username + this.email + this.password)
        // evt.preventDefault();
        // setTimeout( function () {console.log("after 3 secs")},3000)

        this.$http.post('http://68.183.162.185:4941/api/v1/users/login', JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          // alert("im here boi2")
          localStorage.setItem('cachedPassword', this.password);
          this.$cookie.set("userId", response.body.userId);
          this.$cookie.set("authToken", response.body.token);
          location.reload();
          // alert(JSON.stringify(response))


        }, function (error) {
          // alert(JSON.stringify(error));
          this.loginErrorFlag = true
          // this.errorFlag = true;
          // this.userNameOrEmailError = error.statusText.substring(13);
          // alert(this.userNameOrEmailError);

        })
      }
    },
    computed : {
      validation() {
        if (this.username.length >= 1 && this.username.length <= 64){
          return true;
        } else {this.error = "Username must be between 1 and 64 characters long."}
        // alert(this.password + " " + this.confirmPassword)
        // if (this.password !== this.confirmPassword) {
        //   // alert("ree")
        //   return true
        // } else {this.error = "Your passwords do not match!"}
        return false;
      },

      passwordValidation() {
        // alert(this.password + " " + this.confirmPassword)
        if (this.password !== "" && this.password === this.confirmPassword) {
          // alert("ree")
          return true
        }
         // else if (this.password === "" ) {this.error = ""}
        else {this.passwordError = "Passwords do not match!"}
        return false;
      }

    }
  }
</script>
