<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    Venues
    <div  v-if = "errorFlag"  style = " color : red ; ">
      {{ error  }}
    </div>

    <div >

      <div  id = "venues">
<!--        <input type="text" v-model="search" palceholder="search box"/>-->
        <v-card-title>
<!--          Venues-->
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label=""
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
<!--        <v-data-table-->
<!--          :headers="headers1"-->
<!--          :items="res"-->
<!--          :search="search"-->
<!--          class="elevation-1"-->
<!--        >-->
<!--          <template v-slot:items="props">-->
<!--            <td>{{ props.item.name }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.venueId }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.venueName }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.categoryId }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.shortDescription }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.meanStarRating }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.modeCostRating }}</td>-->
<!--            <td class="text-xs-right">{{ props.item.primaryPhoto }}</td>-->
<!--            <td class="text-xs-right">-->
<!--              <router-link :to = "{ name: 'city', params: { cityName: props.item.city}}" >-->
<!--              <button  type = "button"  class = "btn btn-primary"  data-toggle = "modal"-->
<!--                       data-target = "#viewVenuesInCity">-->
<!--              {{ props.item.city }}-->
<!--            </button></router-link>-->
<!--            </td>-->
<!--&lt;!&ndash;            <td class="text-xs-right">{{ props.item.iron }}</td>&ndash;&gt;-->
<!--          </template>-->
<!--        </v-data-table>-->

        <table id="tablee" class="table table-hover ">
          <thead class="thead-dark">
          <th scope="col">#Venue Id</th>
          <th scope="col">Venue Name</th>
          <th scope="col">Category</th>
          <th scope="col">Short Description</th>
          <th scope="col">Star Rating</th>
          <th scope="col">Cost Rating</th>
          <th scope="col">photo</th>
          <th scope="col">City</th>
          <th scope="col">View Venue</th>

          </thead>
          <tbody>
          <tr  v-for = "venue in filterdData">
            <td hidden> {{ venue }} </td>
            <td> {{ venue.venueId }} </td>
            <td> {{ venue.venueName }} </td>
            <td>{{getCategory(venue.categoryId).categoryName}}</td>
<!--            <td> {{ venue.categoryId }} </td>-->
            <td> {{ venue.shortDescription }} </td>
            <td> {{ venue.meanStarRating }} </td>
            <td> {{ venue.modeCostRating }} </td>
            <td> {{ venue.primaryPhoto }} </td>

<!--            <img src="http://68.183.162.185:4941/api/v1/venues/1/photos/testFile-1557557876254.jpeg" width="300px">-->
            <td><router-link :to = "{ name: 'city', params: { cityName: venue.city}}" >
              <button  type = "button"  class = "btn btn-primary"  data-toggle = "modal"
                       data-target = "#viewVenuesInCity">
                {{ venue.city }}
              </button>
            </router-link></td>
            <td><router-link :to = "{ name: 'venue', params: { venueId: venue.venueId}}" > View venue</router-link></td>
          </tr>
          </tbody>
              <div  class = "modal fade"  id = "viewVenuesInCity"  tabindex = "-1"  role = "dialog"
                    aria-labelledby = "deleteUserModalLabel"  aria-hidden = "true">
                <div  class = "modal-dialog"  role = "document">
                  <div  class = "modal-content">
                    <div  class = "modal-header">
                      <h5  class = "modal-title"  id = "deleteUserModalLabel" > All venues in this city </h5>
                      <button  type = "button"  class = "close"  data-dismiss = "modal"  aria-label = "Close">
                        <span  aria-hidden = "true" > &times; </span>
                      </button>
                    </div>
                    <div  class = "modal-body">
<!--                      {{$route.params}}-->
                      {{getVenuesInCity($route.params.cityName)}}
                      <table class="table table-hover table-sm table-striped table-dark">
                        <thead class="thead-dark">
                        <th scope="col">#Venue Id</th>
                        <th scope="col">Venue Name</th>
                        <th scope="col">Short Description</th>
                        </thead>
                        <tbody>
                        <tr v-for = "venue in venuesInCity">
                          <td>{{venue.venueId}}</td>
                          <td>{{venue.venueName}}</td>
                          <td>{{venue.shortDescription}}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>



                    <div  class = "modal-footer">
                      <button  type = "button"  class = "btn btn-secondary"  data-dismiss = "modal">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
        </table>
      </div>
    </div>


  </div>
</template>


<script>
  export  default {
    data  (){
      return{
        error :  "",
        errorFlag :  false,
        venues :  [],
        venuesInCity : [],
        categories : [],
        search : "",
        searchTerm : "",
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
        res : []
      }
    },
    mounted :  function () {
      this . getVenues ();
      this . getCategories ();
      // this.populateTable();
    },
    methods : {
      // populateTable () {
      //   var jsonData = {};
      //   // alert(this.venues.length);
      //
      //   for (var i = 0; i < this.venues.length; i++) {
      //        for (var j = 0; j < Object.keys(this.venues[i]).length; j++){
      //          console.log(Object.keys(this.venues[i])[j]);
      //           if (Object.keys(this.venues[i])[j] === "venueId") {
      //
      //             jsonData["venueId"] = this.venues[i].venueId;
      //             // alert("data" + Object.keys(this.venues[i])[j] + "  " + this.venues[j].String(Object.keys(this.venues[i])[j]));
      //             // this.res.push(jsonData);
      //           }
      //           if (Object.keys(this.venues[i])[j] === "venueName") {
      //               jsonData["venueName"] = this.venues[i].venueName;
      //            }
      //           if (Object.keys(this.venues[i])[j] === "categoryId") {
      //             console.log("resr" + this.venues[i].categoryId);
      //             // let namee = this.getCategory(this.venues[i].categoryId);
      //             // jsonData["categoryId"] = this.getCategory(this.venues[i].categoryId);
      //             jsonData["categoryId"] = this.venues[i].categoryId;
      //           }
      //          if (Object.keys(this.venues[i])[j] === "shortDescription") {
      //            jsonData["shortDescription"] = this.venues[i].shortDescription;
      //          }
      //          if (Object.keys(this.venues[i])[j] === "meanStarRating") {
      //            jsonData["meanStarRating"] = this.venues[i].meanStarRating;
      //          }
      //          if (Object.keys(this.venues[i])[j] === "modeCostRating") {
      //            jsonData["modeCostRating"] = this.venues[i].modeCostRating;
      //          }
      //          if (Object.keys(this.venues[i])[j] === "primaryPhoto") {
      //            jsonData["primaryPhoto"] = this.venues[i].primaryPhoto;
      //          }
      //          if (Object.keys(this.venues[i])[j] === "city") {
      //            jsonData["city"] = this.venues[i].city;
      //          }
      //        }
      //       this.res.push(jsonData);
      //       jsonData = {};
      //   }
      //   console.log("reeee" +JSON.stringify( this.res));
      // },
      getVenues: function () {
        this.$http.get('http://68.183.162.185:4941/api/v1/venues')
          .then(function (response) {
            this.venues = response.data;
            // this.populateTable();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getVenuesInCity: function (city) {
        let venues = [];
        for (var i = 0; i < this.venues.length; i++) {
          if (this.venues [i].city === city) {
            venues.push(this.venues[i]);
          }
        }
        this.venuesInCity = venues;
        // return venues;
      },
      getCategories: function () {

        this.$http.get('http://68.183.162.185:4941/api/v1/categories')
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

      getCategory: function (Id) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].categoryId === Id) {
            return this.categories[i];
            // console.log(this.categories[i].categoryName);
          }
        }
      },
      updateSearch: function () {
        this.$http.get('http://68.183.162.185:4941/api/v1/venues', {
            params: {
              "q": this.searchTerm,
              "categoryId": this.categoryId
            }
          }
        ).then(function (response) {
          this.venues = response.data;
        }, function (error) {
          console.log(error);
        });
      }

    },
    computed : {
      filterdData : function(){
        return this.venues.filter((v) => {
          // alert(v.title)
          return v.venueName.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || v.shortDescription.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
          // (v.venueName.match(this.search)
            // v.venueId.match(this.search) ||

        })
      }
    }
  }
</script>
