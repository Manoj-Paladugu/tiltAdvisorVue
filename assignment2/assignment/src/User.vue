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



          <div>
          <b-button variant="primary" href="#" v-b-modal="'editProfile-modal'">Edit Profile</b-button>
          <b-form-file accept="image/jpeg, image/png" class="mb-2" v-model="profilePhoto" :state="isFileChosen"  ></b-form-file>
            <b-button variant="primary" href="#" @click="editProfileImage" :state="isFileChosen" >Update Photo</b-button>
            <b-form-invalid-feedback :state="isFileChosen">
              <strong>{{isFileChosenError}}</strong>
            </b-form-invalid-feedback>
            <b-button variant="primary" href="#" @click="deleteProfileImage">Delete Photo</b-button>
          </div>
        </b-jumbotron>
        <div class="text-center col-md-4">
<!--          <b-img src="./default_profile_photo.png" ></b-img>-->
          <b-img thumbnail fluid :src=currentPhoto alt="Image 1"></b-img>
        </div>
<!--          <b-jumbotron text-variant="white" border-variant="dark" class="jumbotron text-center col-md-4" style="background-size:cover" v-bind:style="{ 'background-image': 'url(' + currentPhoto + ')' }" >-->
<!--            <template slot="header"></template>-->
<!--            &lt;!&ndash;          <b-img class="text-center col-md-4" width="200" height="200" v-bind:src="getVenuePhoto($route.params.venueId,this.venue.photos[0].photoFilename)" rounded alt="Rounded image"></b-img>&ndash;&gt;-->
<!--            <b-button variant="primary" href="#" @click="getProfilePhoto">Edit Photo</b-button>-->
<!--          </b-jumbotron>-->
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

          <b-button variant="success" href="#">Do Something Else</b-button>
        </b-jumbotron>
        <div class="text-center col-md-4">
          <!--          <b-img src="./default_profile_photo.png" ></b-img>-->
          <b-img thumbnail fluid :src=currentPhoto alt="Image 1"></b-img>
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
        reviewBody : "",
        starRating : "",
        costRating : "",
        reviews : [],
        // reviewFields : ['reviewAuthor'],
        venue : {},
        user : {},
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 20, 30],
        filter: null,
        error :  "",
        mainProps: { blank: true, blankColor: '#777', width: 75, height: 75, class: 'm1' },
        errorFlag :  false,
        fields: [{key: 'venueId', sortable: true}, 'venueName',{key: 'categoryId',label : 'Category', sortable: true} , 'shortDescription',  {key: 'meanStarRating', sortable: true},
          {key: 'modeCostRating', sortable: true}, 'city',{key: 'primaryPhoto',sortable: true}],
        venues :  [],
        venuesInCity : [],
        categories : [],
        search : "",
        searchTerm : "",
        options: [
          {value: 1, text: 'Accommodation'},
          {value: 2, text: 'Cafés & Restaurants'},
          {value: 3, text: 'Attractions'},
          {value: 4, text: 'Events'},
          {value: 5, text: 'Nature Spots'},
          {value: 6, text: 'Other'}
        ],
        headers1: [
          {
            text: 'Venues',
            align: 'left',
            sortable: false,
            value: 'name1'
          },
          { text: '#Venue Id', value: '#Venue Id' },
          { text: 'Venue Name', value: 'Venue Name' },
          { text: 'Category', value: 'Category' },
          { text: 'Short Description', value: 'Short Description' },
          { text: 'Star Rating', value: 'Star Rating' },
          { text: 'Cost Rating', value: 'Cost Rating' },
          { text: 'photo', value: 'photo' },
          { text: 'City', value: 'City' },
          { text: 'View Venue', value: 'View Venue' }

        ],
        res : [],
        minStarRatingVal : 0,
        minStarOptionSelected: 1,
        maxCostOptionSelected : 4,
        minStarOptions: [
          { value: 1, text: 'Any' },
          { value: 1, text: '>= 1' },
          { value: 2, text: '>= 2' },
          { value: 3, text: '>= 3' },
          { value: 4, text: '>= 4' }
        ],
        categoryOptionSelected: 0,
        categoryOptions: [
          { value: 0, text: 'Any' },
          { value: 1, text: 'Accommodation' },
          { value: 2, text: 'Cafés & Restaurants' },
          { value: 3, text: 'Attractions' },
          { value: 4, text: 'Events' },
          { value: 5, text: 'Nature Spots' }
        ],
        maxCostOptions : [
          { value: 4, text: 'Any' },
          { value: 0, text: 'Free' },
          { value: 1, text: '$' },
          { value: 2, text: '$$' },
          { value: 3, text: '$$$' },
          { value: 4, text: '$$$$' }
        ]
      }
    },
    mounted :  function () {

      // alert(this.password)
      this.getProfilePhoto();
      this . getCategories ();
      this. getReviews();
      this . getVenues ();
      this.getUserInfo();
      // this . getVenue ();
      this.totalRows = this.venues.length
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

      },
      addReview : function () {
        this.$http.post('http://localhost:4941/api/v1/venues/' + this.$route.params.venueId + '/reviews', JSON.stringify({
          reviewBody: this.reviewBody,
          starRating: parseInt(this.starRating),
          costRating: parseInt(this.costRating)

        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          alert(JSON.stringify(response))
          alert("done");
          this. getReviews();


        }, function (error) {
          alert(JSON.stringify(error));
          // this.errorFlag = true;
          // this.userNameOrEmailError = error.statusText.substring(13);
          // alert(this.userNameOrEmailError);

        })
      },
      getReviews : function() {
        this.$http.get('http://localhost:4941/api/v1/venues/' + this.$route.params.venueId + '/reviews')
          .then(function (response) {
            this.reviews = response.data;
            console.log("ereter")
            // alert(this.reviews.some(item => item.reviewAuthor.userId === parseInt(this.$cookie.get('userId'))));
            // alert(JSON.stringify(this.reviews));
          })
      },
      getVenue : function () {
        // alert(JSON.stringify(this.$route.params));
        this.$http.get('http://localhost:4941/api/v1/venues/' + this.$route.params.venueId)
          .then(function (response) {
            this.venue = response.data;
            // alert("here")
            //   alert(this.$cookie.get('authToken'))
            console.log(JSON.stringify(this.venue));
          })

      },

      getVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.venues = response.data;
            // this.updateSearch();
            // console.log("final1 " +JSON.stringify( response.data))
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          }).then ( () =>
            this.venues.forEach(
              (value, index) => {
                value.categoryId = this.getCategoryById(this.venues[index].categoryId).categoryName;
                if (this.venues[index].meanStarRating === null) {this.venues[index].meanStarRating = 3}
                if (this.venues[index].modeCostRating === null) {this.venues[index].modeCostRating = 0}
                // value.city = 'This is <i>raw <strong>{{$this.venues[index].categoryId}}</strong></i> <span style="color:red">content</span>';
                this.totalRows = this.venues.length
                // console.log(index);
                console.log("reee" + value.categoryId)
              }
            )
          // console.log("Reee" + this.venues[0].categoryId)
        );


      },

      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },

      getVenuesInCity: function (city) {
        let venues = [];
        for (var i = 0; i < this.venues.length; i++) {
          if (this.venues [i].city === city) {
            venues.push(this.venues[i]);
          }
        }
        this.venuesInCity = venues;
        // console.log(this.venues[0].categoryId)
        // return venues;
      },
      getCategories: function () {

        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });


        // for ( let i  =  0 ; i  <  this.categories.length ; i ++){
        //   if ( this.categories[i].categoryId  === Id ){
        //      return this.categories[i];
        //      // console.log(this.categories[i].categoryName);
        //   }
        // }
        // return venues;
      },

      getCategoryById: function (Id) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].categoryId === Id) {
            return this.categories[i];
            // console.log(this.categories[i].categoryName);
          }
        }
      },
      // getCategoryByName: function (name) {
      //   for (let i = 0; i < this.categories.length; i++) {
      //     if (this.categories[i].categoryId === name) {
      //       return this.categories[i];
      //       // console.log(this.categories[i].categoryName);
      //     }
      //   }
      // },
      updateSearch: function () {
        // alert("here" + this.minStarOptionSelected)
        let paramLst = {
          "categoryId": this.categoryOptionSelected,
          "minStarRating" : this.minStarOptionSelected,
          "maxCostRating" : this.maxCostOptionSelected
        };
        if (this.search !== "") {paramLst["q"] = this.search}
        // if (this.minStarOptionSelected !== -1) {
        //   paramLst["minStarRating"] = this.minStarOptionSelected
        // }
        // if (this.maxCostOptionSelected !== -1) {
        //   paramLst["maxCostRating"] = this.maxCostOptionSelected
        // }
        this.$http.get('http://localhost:4941/api/v1/venues', {
            // params: paramLst
            params: paramLst
          }
        ).then((response) => {
          console.log(response);
          this.venues = response.data;
        }, function (error) {
          console.log(error);
        }).then(() =>
          this.venues.forEach(
            (value, index) => {
              value.categoryId = this.getCategoryById(this.venues[index].categoryId).categoryName;
              // alert(JSON.stringify(this.venues[index]))
              if (this.venues[index].meanStarRating === null) {this.venues[index].meanStarRating = 3}
              if (this.venues[index].modeCostRating === null) {this.venues[index].modeCostRating = 0}
              // value.city = 'This is <i>raw <strong>{{$this.venues[index].categoryId}}</strong></i> <span style="color:red">content</span>';
              this.totalRows = this.venues.length;
              // console.log(index);
              console.log("reee" + value.categoryId)
            }
          )
        )
      },
      getVenuePhoto: function (venueId,VenuePhotoFileName) {
        // console.log(venueId);
        // console.log( VenuePhotoFileName)
        // if (VenuePhotoFileName === "") {console.log(venueId + "empty")}

        return 'http://localhost:4941/api/v1/venues/' + venueId + '/photos/' + VenuePhotoFileName;
      },
      getVenuesByCategory: function (categoryId) {

        this.$http.get('http://localhost:4941/api/v1/venues/', {
            params: {
              "categoryId": categoryId
            }
          }
        ).then(function (response) {
          this.venues = [];

          if (categoryId === 6) {this.venues = this.getVenues()}
          else {
            response.body.forEach(
              (value, index) => {
                // if (this.venues[index].meanStarRating === null) {this.venues[index].meanStarRating = 3}
                value.categoryId = this.getCategoryById(response.body[index].categoryId).categoryName;
                // value.city = 'This is <i>raw <strong>{{$this.venues[index].categoryId}}</strong></i> <span style="color:red">content</span>';
              }
            );
            for (let i = 0; i < response.body.length; i++) {
              // console.log(i + " " + JSON.stringify(response.body));
              this.venues.push(response.body[i])
            }
          }


        }, function (error) {
          console.log(error);
        });
      },

      getVenuesByMinStarRating : function (id) {
        // alert(id)
        // this.getVenues();
        // var allVenues = this.venues.slice();
        // console.log("boii " + allVenues)
        // this.venues = [];
        this.$http.get('http://localhost:4941/api/v1/venues/', {
            params: {
              // "minStarRating": id,
              "minStarRating": id
            }
          }
        ).then( (response) => {
          // alert(JSON.stringify(response.body))
          this.venues = response.body;
          // for (let i = 0; i < allVenues.length;i++) {
          //   console.log("a  " + allVenues[i]);
          //   if (allVenues[i].meanStarRating === 3 && allVenues[i].meanStarRating >= id) {this.venues.push(allVenues[i])}
          //   if ((allVenues[i].meanStarRating === null || allVenues[i].meanStarRating === undefined)) {
          //     allVenues[i].meanStarRating = 3;
          //     console.log("gettt " + allVenues[i].meanStarRating)
          //     this.venues.push(allVenues[i])
          //   }
          // }
          console.log("min sheeit " + JSON.stringify(this.venues))

        }, function (error) {
          console.log(error);
        });
      },
      getVenuesByMaxCostRating : function (id) {
        // this.getVenues(); called onclick on dropdown
        var allVenues = this.venues.slice();
        this.venues = [];
        this.$http.get('http://localhost:4941/api/v1/venues/', {
            params: {
              // "minStarRating": id,
              "maxCostRating": id
            }
          }
        ).then( (response) => {
          this.venues = response.body;
          // alert(JSON.stringify(response.body));
          for (let i = 0; i < allVenues.length;i++) {
            console.log("a  " + allVenues[i]);
            if (allVenues[i].modeCostRating === 0 && allVenues[i].modeCostRating <= id) {this.venues.push(allVenues[i])}
            if ((allVenues[i].modeCostRating === null || allVenues[i].modeCostRating === undefined)) {
              allVenues[i].modeCostRating = 0;
              console.log("gettt " + allVenues[i].modeCostRating);
              this.venues.push(allVenues[i])
            }
          }
          console.log("cost sheeit " + JSON.stringify(this.venues))

        }, function (error) {
          console.log(error);
        });
      }



    },

    computed : {
      // filterdData : function(){
      //   return this.venues.filter((v) => {
      //     // alert(v.title)
      //     return v.venueName.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || v.shortDescription.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
      //     // (v.venueName.match(this.search)
      //     // v.venueId.match(this.search) ||
      //
      //   })
      // },
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      },
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
