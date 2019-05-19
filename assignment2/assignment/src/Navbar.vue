<template id="navBar">
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">



          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-navbar-nav right v-if="!this.$cookie.get('authToken')">
            <b-nav-item href="#" v-b-modal="'register-modal'">Register</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="!this.$cookie.get('authToken')">
            <b-nav-item href="#" v-b-modal="'login-modal'" >Login</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav right v-if="this.$cookie.get('authToken')">
            <b-nav-item href="#"  @click="logoutUser">Logout</b-nav-item>
          </b-navbar-nav>
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content"><em>User</em></template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal  id="register-modal" size="xl" title="Register" hide-footer>
      <b-form  @submit="registerUser">
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

    <b-modal  id="login-modal" size="xl" title="Register" hide-footer>
      <b-form  @submit="loginUser">
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

          <b-btn style="float: right" variant="primary" type="submit" data-dismiss="modal@click=" >Register</b-btn>
          <!--          @click="$bvModal.hide('register-modal')"-->

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
        error : "",
        passwordError : "",
        userNameOrEmailError : "",
        errorFlag : false,
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
      goToLogin : function () {
        // this.$router.push('/login')
        // alert("aa")
      },
      logoutUser : function() {
        this.$http.post('http://127.0.0.1:4941/api/v1/users/logout', {}, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          this.$cookie.delete("userId");
          this.$cookie.delete("authToken");
          location.reload();
        }
        );

      },
      registerUser : function() {
        if (this.validation && this.passwordValidation) {
          this.$http.post('http://localhost:4941/api/v1/users', JSON.stringify({
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
            this.loginUser();

            alert(JSON.stringify(response))
          }, function (error) {
            alert(JSON.stringify(error));
            if (error.status !== 200) {
              this.errorFlag = true;
              this.userNameOrEmailError = error.statusText.substring(13);
            }
            // alert(this.userNameOrEmailError);

          })

        }
      },
      loginUser : function () {
        this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          this.$cookie.set("userId", response.body.userId)
          this.$cookie.set("authToken", response.body.token)
          alert(JSON.stringify(response))


        }, function (error) {
          // alert(JSON.stringify(error));
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
