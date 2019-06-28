<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>

<!--    Venues-->
    <div  v-if = "errorFlag"  style = " color : red ; ">
      {{ error  }}
    </div>

    <Navbar></Navbar>
      <div  id = "venues">

        <v-card-title>
          <div>
            <strong>Category</strong>
            <b-form-select v-model="categoryOptionSelected" :options="categoryOptions" @input="updateVenues"></b-form-select>
          </div>

          <div>
            <strong>Star Rating</strong>
            <b-form-select v-model="minStarOptionSelected" :options="minStarOptions" @input="updateVenues"></b-form-select>
          </div>

          <div>
            <strong>Cost Rating</strong>
            <b-form-select v-model="maxCostOptionSelected" :options="maxCostOptions" @input="updateVenues"></b-form-select>
          </div>

          <div>
            <strong>City</strong>
            <b-form-select v-model="cityOptionSelected" :options="cityOptions" @input="updateVenues"></b-form-select>
          </div>

          <div>
            <b-button @click="updateVenues">View Distance</b-button>
          </div>



          <v-text-field
            v-model="search"
            append-icon="search"
            label=""
            single-line
            hide-details
            @input="updateVenues"
          ></v-text-field>
        </v-card-title>
        <div>
          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
          </b-row>
          <b-table striped hover :items="venues" :fields="fields" :sort-by.sync="meanStarRating" :sort-desc.sync="sortDesc"
                   :filter="filter" :current-page="currentPage" :total-rows="totalRows" :per-page="perPage" @filtered="onFiltered">

            <template slot="distance" slot-scope="row">

                <td>
                  {{row.value}}
                </td>

            </template>

            <template slot="venueName" slot-scope="row">
              <router-link :to = "{ name: 'venue', params: { venueId: row.item.venueId}}" >
                <td>
                  {{row.value}}
                </td>
              </router-link>
            </template>

            <template slot="primaryPhoto" slot-scope="row">
              <span v-if="row.value !== ''">
              <b-img width="200" height="200" v-bind:src="getVenuePhoto(row.item.venueId,row.value)" rounded alt="Rounded image"></b-img>
              </span>
              <span v-else>
                <b-img width="200" height="200" v-bind="venuePhotoProps" :src=defaultVenuePhoto rounded alt="Rounded image"></b-img>
              </span>
            </template>


<!--            <span slot="city" slot-scope="data" v-html="data.value"></span>-->
          </b-table>

          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
          </b-row>
        </div>

    </div>


  </div>
</template>


<script>
  import Navbar from "./Navbar";
  export  default {
    components: {Navbar},
    data  (){
      return{
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 20, 30],
        filter: null,
        error :  "",
        venuePhotoProps: { width: 75, height: 75, class: 'm1' },
        defaultVenuePhoto : "src/defaultVenueImage.png",
        errorFlag :  false,
        fields: [{key: 'venueId', sortable: true}, 'venueName',{key: 'categoryId',label : 'Category', sortable: true} , 'shortDescription',  {key: 'meanStarRating', sortable: true},
          {key: 'modeCostRating', sortable: true},{key: 'distance', sortable: true}, 'city',{key: 'primaryPhoto',sortable: true}],
        venues :  [],
        venuesInCity : [],
        categories : [],
        search : null,
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
        cityOptionSelected : 'Any',
        cityOptions : [
          'Any'
        ],
        sortDistanceOptionSelected : -1,
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

        lat : 0,
        long : 0
      }
    },
    mounted :  function () {
      this.updateMyLocation();
      this . getCategories ();
      this.updateVenues();
      // alert(venue)
      this.totalRows = this.venues.length;
    },
    methods : {

      updateMyLocation : function() {
        navigator.geolocation.getCurrentPosition((location) => {
          this.lat =  Math.floor(Number(location.coords.latitude));
          this.long =  Math.floor(Number(location.coords.longitude));
        });
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
      updateVenues: function () {

        // alert(this.cityOptionSelected);
        let paramLst = {

          "categoryId": this.categoryOptionSelected,
          "minStarRating" : this.minStarOptionSelected,
          "maxCostRating" : this.maxCostOptionSelected,
          "myLatitude" : this.lat,
          "myLongitude" : this.long
        };
        // alert(this.lat)

        if (this.search !== null && this.search !== '') {paramLst.q = this.search}
        else { delete paramLst['q']}
        // alert(this.cityOptionSelected)
        if (this.cityOptionSelected !== "Any") {paramLst.city = this.cityOptionSelected}
        else {delete paramLst['city']}

        this.$http.get('http://localhost:4941/api/v1/venues', {
          params: paramLst
          }
        ).then((response) => {
          this.venues = response.data;
          return response.data;
        }, function (error) {
          console.log(error);
        }).then((response) => {
          this.venues.forEach(
          (value, index) => {

            if (this.cityOptions.indexOf(value.city) === -1 ) {
              this.cityOptions.push(value.city);
            }

            console.log(value.city);
            //USE AN ARRAY FOR OPTIONS

            value.categoryId = this.getCategoryById(response[index].categoryId).categoryName;

            if (response[index].meanStarRating === null) {response[index].meanStarRating = 3}
            if (response[index].modeCostRating === null) {response[index].modeCostRating = 0}
            // if (this.venues[index].distance !== null) {this.venues[index].distance = 0}
            // console.log("reee" + value.categoryId)
          }
          );
            this.venues = response;

            this.totalRows = this.venues.length;
        }

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

          if (categoryId === 6) {this.venues = this.updateVenues()}
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
      }
    }
  }
</script>
