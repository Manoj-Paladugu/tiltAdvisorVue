<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <div>
<!--    Venue-->
    <div  v-if = "errorFlag"  style = " color : red ; ">
      {{ error  }}
    </div>
    <Navbar></Navbar>

    <div class="row">
      <b-jumbotron class="jumbotron text-center col-md-8">
        <template slot="header">{{this.venue.venueName}}</template>
<!--        <template  v-if="this.venue.longDescription !== ''">-->
<!--          Long Description : {{ this.venue.longDescription}}-->
<!--        </template>-->
        <hr class="my-4">
        <div id="venues" v-for = "venue in venues">
          <p v-if="venue.venueId === parseInt($route.params.venueId)">Star Rating : {{ venue.meanStarRating }} </p>
          <p v-if="venue.venueId === parseInt($route.params.venueId)">Cost Rating : {{ venue.modeCostRating }} </p>

        </div>
        <p >Venue Admin : {{ this.venue.admin.username }} </p>
        <p>Venue added on : {{this.venue.dateAdded}}</p>
        <p>Category : {{this.venue.category.categoryName}}</p>
        <p>Category Desc : {{this.venue.category.categoryDescription}}</p>
        <p >City : {{ this.venue.city }} </p>
        <p>
          Address : {{this.venue.address}}
        </p>
        <hr class="my-4">
        <template slot="lead">
         Description :  {{this.venue.shortDescription}}.
        </template>
        <template slot="lead">
          {{this.venue.longDescription}}
        </template>
        <hr class="my-4">
        <div>
          <b-button variant="primary" href="#" v-if="this.venue.admin.userId === parseInt(this.$cookie.get('userId'))" v-b-modal="'editVenue-modal'">Edit Venue</b-button>
          <b-form-file accept="image/jpeg, image/png" class="mb-2" v-model="venuePhoto" :state="isFileChosen" v-if="this.venue.admin.userId === parseInt(this.$cookie.get('userId'))" ></b-form-file>

          <b-button variant="primary" href="#" @click="addVenueImage" :state="isFileChosen" v-if="this.venue.admin.userId === parseInt(this.$cookie.get('userId'))">Add Photo</b-button>
          <b-form-invalid-feedback :state="isFileChosen">
            <strong v-if="this.venue.admin.userId === parseInt(this.$cookie.get('userId'))">{{isFileChosenError}}</strong>
          </b-form-invalid-feedback>
          <b-button variant="primary" href="#" @click="deleteVenueImage" v-if="this.venue.admin.userId === parseInt(this.$cookie.get('userId'))">Delete Current Photo</b-button>
          <b-button variant="primary" href="#" @click="setVenueImagePrimary" v-if="this.venue.admin.userId === parseInt(this.$cookie.get('userId'))">Set Current Photo As Primary</b-button>
        </div>
      </b-jumbotron>
<!--        <b-jumbotron v-if="this.venue.photos.length !== 0" text-variant="white" border-variant="dark" class="jumbotron text-center col-md-4" style="background-size:cover" :style="{'background-image': `url(${(getVenuePhoto($route.params.venueId,this.venue.photos[0].photoFilename))})`}" >-->
<!--          <template slot="header">{{this.venue.photos[0].photoDescription}}</template>-->
<!--&lt;!&ndash;          <b-img class="text-center col-md-4" width="200" height="200" v-bind:src="getVenuePhoto($route.params.venueId,this.venue.photos[0].photoFilename)" rounded alt="Rounded image"></b-img>&ndash;&gt;-->
<!--          <b-button variant="primary" href="#">Edit Photo</b-button>-->
<!--        </b-jumbotron>-->

      <div class="text-center col-md-4" v-if="this.venue.photos.length === 0">
        <b-carousel

          id="carousel-1"
          v-model="slide"
          :interval="1500"
          controls
          indicators
          background="#ababab"
          img-width="1024"
          img-height="480"
          style="text-shadow: 1px 1px 2px #333;"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >


          <!-- Slides with custom text -->
          <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
            <h1>Add Venue Images!</h1>
          </b-carousel-slide>

        </b-carousel>

      </div>

      <div class="text-center col-md-4" v-else>
        <b-carousel

          v-model="slide"
          :interval="4000"
          controls
          indicators
          background="#ababab"
          img-width="1024"
          img-height="480"
          style="text-shadow: 1px 1px 2px #333;"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <div class="carousel-inner">
            <div class="carousel-item" v-for="(banner,idx) in this.allVenuePhotos" :class="{ active: idx==0 }">
              <img :src="getVenuePhoto(banner)" alt="" class="img-fluid">

            </div>
          </div>
          {{this.allVenueDescriptions[this.slide]}}

        </b-carousel>

        <p class="mt-4">
          Slide #: {{ slide }}<br>
          Sliding: {{ sliding }}
        </p>
      </div>


    </div>

    <div>
      <b-jumbotron header="Reviews" lead="for this venue" >
        <div class="text-right" v-if="this.$cookie.get('authToken') && !this.reviews.some(item => item.reviewAuthor.userId === parseInt(this.$cookie.get('userId')))">
          <b-button v-b-modal="'review-modal'" variant="primary" href="#" v-if="this.venue.admin.userId !== parseInt(this.$cookie.get('userId'))">  Add Review</b-button>

<!--          modal for posting a review-->

          <b-modal  id="review-modal" size="xl" title="Add a review" hide-footer>
            <b-form  @submit="addReview">
              <b-card bg-variant="light" class="m-4 p-2">

                <b-form-group
                  horizontal
                  label="Star Rating:"
                  required
                >
                  <b-form-input v-model="starRating" type="number" inline ></b-form-input>
                </b-form-group>

                <b-form-group
                  horizontal
                  label="costRating:"
                  label-for="input-4"
                >
                  <b-form-input type="number" v-model="costRating" inline required></b-form-input>
                </b-form-group>

                <b-form-invalid-feedback >
                  <strong>{{error}}</strong>
                </b-form-invalid-feedback>

                <b-form-group horizontal label="reviewBody:" description="You must provide a review in order to submit.">
                  <b-form-input v-model="reviewBody" type="text" inline required></b-form-input>
                </b-form-group>

                <b-btn style="float: right" variant="primary" type="submit" data-dismiss="modal@click=" >Submit</b-btn>
                <!--          @click="$bvModal.hide('register-modal')"-->

              </b-card>
            </b-form>
          </b-modal>


        </div>
        <b-table striped hover :items="reviews">
          <template slot="reviewAuthor" slot-scope="row">
              <td>
                {{row.value.username}}
              </td>

          </template>
        </b-table>
      </b-jumbotron>
    </div>

    <b-modal  id="editVenue-modal" size="xl" title="Edit Venue Details" hide-footer>
      <b-form @submit.stop.prevent="editAdminVenue">
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

          <b-button style="float: right" variant="primary" type="submit" data-dismiss="modal@click=" >Submit</b-button>
          <!--          @click="$bvModal.hide('register-modal')"-->

        </b-card>
      </b-form>
    </b-modal>

  </div>
</template>


<script>
  import Navbar from "./Navbar";
  export  default {
    components: {Navbar},
    data  (){
      return{
        venuePhoto : null,
        description : "",
        slide: 0,
        sliding: null,
        reviewBody : "",
        starRating : "",
        costRating : "",
        reviews : [],
        // reviewFields : ['reviewAuthor'],
        venue : {},
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
        ],
        allVenuePhotos : [],
        allVenueDescriptions : []
      }
    },
    mounted :  function () {
      this . getCategories ();
      this. getReviews();
      this . getVenues ();
      this . getVenue ();

      this.totalRows = this.venues.length

      // this . getCategory ();
    },
    methods : {
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      },
      setVenueImagePrimary : function() {
        this.$http.post('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId + '/photos/' + this.allVenuePhotos[this.slide] + '/setPrimary', {},{
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          // alert(JSON.stringify(response));
          location.reload();
          // this.getProfilePhoto();
        })
      },
      deleteVenueImage : function(){

        this.$http.delete('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId + '/photos/' + this.allVenuePhotos[this.slide], {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          // alert(JSON.stringify(response));
          location.reload();
          // this.getProfilePhoto();
        })
      },
      addVenueImage : function(e) {
        if(!this.isFileChosen) {e.preventDefault(); return;}
        else if (this.venuePhoto.size > 1024 * 1024 * 20) {e.preventDefault(); return;}


        let formData = new FormData();
        formData.append('photo',this.venuePhoto);
        formData.append('description',this.description);
        formData.append('makePrimary',"true");

        this.$http.post('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId + '/photos', formData, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          // alert(JSON.stringify(response));
          location.reload();
        }, function (error) {
          // alert(JSON.stringify(error));
        })

      },
      editAdminVenue : function() {

        this.$http.patch('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId, JSON.stringify({
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
        })
      },
      addReview : function () {
        this.$http.post('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId + '/reviews', JSON.stringify({
          reviewBody: this.reviewBody,
          starRating: parseInt(this.starRating),
          costRating: parseInt(this.costRating)

        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookie.get('authToken')
          }
        }).then(function (response) {
          // alert(JSON.stringify(response))
          // alert("done");
          this. getReviews();


        }, function (error) {
          // alert(JSON.stringify(error));
          // this.errorFlag = true;
          // this.userNameOrEmailError = error.statusText.substring(13);
          // alert(this.userNameOrEmailError);

        })
      },
      getReviews : function() {
        this.$http.get('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId + '/reviews')
          .then(function (response) {
            this.reviews = response.data;
            console.log("ereter")
            // alert(this.reviews.some(item => item.reviewAuthor.userId === parseInt(this.$cookie.get('userId'))));
            // alert(JSON.stringify(this.reviews));
          })
      },
      getVenue : function () {
        // alert(JSON.stringify(this.$route.params));
        this.$http.get('http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId)
          .then(function (response) {
            this.venue = response.data;
            // alert((this.venue.photos))
            // alert((this.venue.photos[0]))
            for (let i = 0; i < (this.venue.photos).length;i++){

              // alert(this.venue.photos[i].photoFilename)
              this.allVenuePhotos.push(this.venue.photos[i].photoFilename)
              this.allVenueDescriptions.push(this.venue.photos[i].photoDescription)
            }




            // alert("here")
            //   alert(this.$cookie.get('authToken'))
            // alert(JSON.stringify(this.venue));
          })

      },

      getVenues: function () {
        this.$http.get('http://134.209.3.158:4941/api/v1/venues')
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

        this.$http.get('http://134.209.3.158:4941/api/v1/categories')
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
        this.$http.get('http://134.209.3.158:4941/api/v1/venues', {
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
      getVenuePhoto: function (VenuePhotoFileName) {
        // console.log(venueId);
        // console.log( VenuePhotoFileName)
        // if (VenuePhotoFileName === "") {console.log(venueId + "empty")}

        return 'http://134.209.3.158:4941/api/v1/venues/' + this.$route.params.venueId + '/photos/' + VenuePhotoFileName;
      },
      getVenuesByCategory: function (categoryId) {

        this.$http.get('http://134.209.3.158:4941/api/v1/venues/', {
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
        this.$http.get('http://134.209.3.158:4941/api/v1/venues/', {
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
        this.$http.get('http://134.209.3.158:4941/api/v1/venues/', {
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
      isFileChosen() {
        if (!Boolean(this.venuePhoto)){
          this.isFileChosenError = "Please choose a file";
          return false;
        } else if (this.venuePhoto.size > 1024 * 1024 * 20){
          this.isFileChosenError = "File size too big (> 20MB)";
          return false;
        }

        return true;
      },
    }
  }
</script>
