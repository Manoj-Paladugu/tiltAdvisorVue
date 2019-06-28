<template>

  <div>
<!--    User-->
    <div  v-if = "errorFlag"  style = " color : red ; ">
      {{ error  }}
    </div>
    <Navbar></Navbar>

    <div v-if="this.$cookie.get('userId') === this.$route.params.id">
      <div class="row">
        <b-jumbotron class="jumbotron text-center col-md-8">
          <template slot="header">Welcome {{this.user.givenName}}!</template>
          <p slot="lead">
            Full Name : {{this.user.givenName}} {{this.user.familyName}}
          </p>
          <p slot="lead">Username : {{this.user.username}} </p>
          <p slot="lead">Email : {{this.user.email}} </p>


          <hr class="my-4">
          <b-button variant="primary" href="#" v-b-modal="'editProfile-modal'">Edit Profile</b-button>

        </b-jumbotron>
        <div class="text-center col-md-4">
          <b-jumbotron class="jumbotron">
<!--          <b-img src="./default_profile_photo.png" ></b-img>-->
            <b-img  v-bind="displayPhotoProps" thumbnail  fluid :src=currentPhoto alt="Image 1"></b-img>
            <hr class="my-4">
            <div>

              <b-button variant="primary" href="#" v-b-modal="'editProfilePhoto-modal'" >Update Photo</b-button>

            </div>
          </b-jumbotron>
        </div>

        <b-modal  id="editProfilePhoto-modal" size="xl" title="Edit Photo" hide-footer>
          <div>
            <b-form-file accept="image/jpeg, image/png" class="mb-2" v-model="profilePhoto" :state="isFileChosen"  ></b-form-file>
            <b-button variant="primary" href="#" @click="editProfileImage" :state="isFileChosen" >Update Photo</b-button>
            <b-form-invalid-feedback :state="isFileChosen">
              <strong>{{isFileChosenError}}</strong>
            </b-form-invalid-feedback>
            <b-button variant="primary" href="#" @click="deleteProfileImage">Delete Photo</b-button>
          </div>
        </b-modal>
      </div>
      <b-modal  id="editProfile-modal" size="xl" title="Edit Profile" hide-footer>
        <b-form @submit.stop.prevent="editUserProfile">
          <b-card bg-variant="light" class="m-4 p-2">
            <b-form-group
              horizontal
              label="Given Name:"
              label-for="input-3"
              required
            >
              <b-form-input v-model="newGivenName" type="text" inline ></b-form-input>
            </b-form-group>

            <b-form-group
              horizontal
              label="Family Name:"
              label-for="input-4"
            >
              <b-form-input type="text" v-model="newFamilyName" inline required></b-form-input>
            </b-form-group>

            <b-form-invalid-feedback >
              <strong>{{error}}</strong>
            </b-form-invalid-feedback>

            <b-form-group horizontal label="Current Password:">
              <b-form-input v-model="oldPassword" type="password" inline required :state="oldPasswordValidation"></b-form-input>
            </b-form-group>

            <b-form-invalid-feedback :state="oldPasswordValidation">
              <strong>Incorrect current password entered.</strong>
            </b-form-invalid-feedback>

            <b-form-group horizontal label="New Password:" description="We'll never share your password with anyone else.">
              <b-form-input v-model="newPassword" type="password" inline required></b-form-input>
            </b-form-group>

            <b-button style="float: right" variant="primary" type="submit" data-dismiss="modal@click=" >Submit</b-button>
            <!--          @click="$bvModal.hide('register-modal')"-->

          </b-card>
        </b-form>
      </b-modal>

    </div>


    <div v-else>
      <div class="row">
        <b-jumbotron class="jumbotron text-center col-md-8">
          <template slot="header">Welcome {{this.user.givenName}}!</template>
          <p slot="lead">
            Full Name : {{this.user.givenName}} {{this.user.familyName}}
          </p>
          <p slot="lead">Username : {{this.user.username}} </p>


          <hr class="my-4">


        </b-jumbotron>

          <div class="text-center col-md-4">
            <b-jumbotron class="jumbotron">
            <!--          <b-img src="./default_profile_photo.png" ></b-img>-->
              <b-img v-bind="displayPhotoProps" thumbnail fluid :src=currentPhoto alt="Image 1"></b-img>
            </b-jumbotron>
          </div>

<!--              <b-jumbotron text-variant="white" border-variant="dark" class="jumbotron text-center col-md-4" style="background-size:cover" :style="{'background-image': `url(${getProfilePhoto()})`}" >-->
<!--                <template slot="header"></template>-->
<!--                &lt;!&ndash;          <b-img class="text-center col-md-4" width="200" height="200" v-bind:src="getVenuePhoto($route.params.venueId,this.venue.photos[0].photoFilename)" rounded alt="Rounded image"></b-img>&ndash;&gt;-->
<!--&lt;!&ndash;                <b-button variant="primary" href="#">Edit Photo</b-button>&ndash;&gt;-->
<!--              </b-jumbotron>-->
      </div>
    </div>
<!--    <img src="./default_profile_photo.png" />-->
  </div>

</template>


<script>
  import Navbar from "./Navbar";
  export  default {
    components: {Navbar},
    data  (){
      return{
        currentPhoto : null,
        profilePhoto : null,
        oldPassword : "",
        newGivenName : "",
        newFamilyName : "",
        newPassword : "",
        user : {},
        error :  "",
        errorFlag :  false,

        displayPhotoProps: {  width: 250, height: 250, class: 'm1' }
      }
    },
    mounted :  function () {

      // alert(this.password)
      this.getProfilePhoto();
      this.getUserInfo();
      // this . getVenue ();

      // this . getCategory ();
    },
    methods : {
      deleteProfileImage : function() {
        this.$http.delete('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo', {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          // alert(response);
          location.reload();
          // this.getProfilePhoto();
        })
      },
      editProfileImage : function(e) {
        if(!this.isFileChosen) {e.preventDefault(); return;}
        else if (this.profilePhoto.size > 1024 * 1024 * 20) {e.preventDefault(); return;}

        this.$http.put('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo', this.profilePhoto, {
          headers: {
            'Content-Type': 'image/png',
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
            // alert(response);
            location.reload();
            // this.getProfilePhoto();
        })

      },
      getProfilePhoto : function() {

        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo')
          .then( (response) => {
            if (response.status === 200) {
              // alert("here");
              this.currentPhoto = 'http://localhost:4941/api/v1/users/' + this.$route.params.id + '/photo'
            }
          }, function (error) {
            // alert(JSON.stringify(error));
            if (error.status !== 200) {
              this.currentPhoto = require('./default_profile_photo.png')
            }
          });

      },
      editUserProfile : function() {

        // alert(this.newGivenName + this.newFamilyName + this.password + this.newPassword)
        // alert(this.oldPasswordValidation)
        if (this.oldPasswordValidation) {
          // alert("here2");
          this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.id, {
            "givenName": this.newGivenName,
            "familyName": this.newFamilyName,
            "password": this.newPassword

          }, {
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': this.$cookie.get('authToken')
            }
          }).then(() => {
              // alert("here3");
              localStorage['cachedPassword'] = this.newPassword;
              location.reload();
              // console.log(JSON.stringify(response));
            }
          )
        } else {alert("mistakes were made")}
      },
      getUserInfo : function () {
        // alert(JSON.stringify(this.$route.params));
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.id,{
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            this.user = response.data;
            // alert("here")
            //   alert(this.$cookie.get('authToken'))
            // alert(JSON.stringify(this.user));
          })

      }

    },

    computed : {

      oldPasswordValidation() {
        // alert(this.password + " " + this.confirmPassword)
        if (this.oldPassword !== "" && this.oldPassword === localStorage.getItem("cachedPassword")) {

          return true
        }
        // else if (this.password === "" ) {this.error = ""}
        // else {this.passwordError = "Passwords do not match!"}
        return false;
      },
      isFileChosen() {
        if (!Boolean(this.profilePhoto)){
          this.isFileChosenError = "Please choose a file";
          return false;
        } else if (this.profilePhoto.size > 1024 * 1024 * 20){
          this.isFileChosenError = "File size too big (> 20MB)";
          return false;
        }

        return true;
      },
    }
  }
</script>
