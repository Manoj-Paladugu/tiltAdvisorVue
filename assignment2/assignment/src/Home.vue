<template >
  <div>
  <Navbar></Navbar>
    <div>
      <b-jumbotron header="Welcome to tilt advisor">
        <b-img v-bind="mainProps" fluid :src=logo alt="Image 1" border=""></b-img>
        <router-link :to = "{ name: 'venues'}" ><b-button block variant="outline-dark">Browse Venues</b-button></router-link>
        <router-link :to = "{ name: 'venues'}" ><b-button block variant="outline-dark">Sign Up</b-button></router-link>

      </b-jumbotron>
    </div>
  </div>
</template>


<script>
  import Navbar from "./Navbar";
  export  default {
    components: {Navbar},
    data  (){
      return{
        logo : "src/tripadvisorLogo (2).png",
        mainProps: { width: 500, height: 200, class: 'm1'}
      }
    },
    mounted :  function () {
    },
    methods : {
    },
    computed : {
    }
  }
</script>
