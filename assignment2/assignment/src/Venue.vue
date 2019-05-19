<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>

    Venue
    <div  v-if = "errorFlag"  style = " color : red ; ">
      {{ error  }}
    </div>

    <Navbar></Navbar>




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
      this . getCategories ();
      this . getVenues ();
      this.totalRows = this.venues.length
      // this . getCategory ();
    },
    methods : {

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
      }
    }
  }
</script>
