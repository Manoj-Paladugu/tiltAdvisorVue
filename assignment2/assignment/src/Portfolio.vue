<template>
  <div>
      <div class="page-wrapper">
        <div class="container">

          <div class="row main-title" style="align-items: center;justify-content: center;">
            <vue-typed-js :strings="['Hey I\'m Manoj.']" :typeSpeed="110" :startDelay="1000" :backDelay="500">
              <div style="text-align:center;;margin-top:250px; color: white;    font-weight: 500; font-size: 90px;">
                <span class="typing login-text" style="font-family: Ubuntu, Helvetica, Arial, sans-serif; white-space:pre;"></span>
              </div>
            </vue-typed-js>
          </div>
          <div class="row sub-title" style="align-items: center;justify-content: center;">
            <vue-typed-js :strings="['I am a developer.', 'I build and break applications.', 'I consume coffee...^1000 LOTS of it :)']" :typeSpeed="110" :startDelay="3200" :backDelay="500" :smartBackspace="true">
              <div style="text-align:center; ;margin-top:0px; color: white; font-size: 25px;">
                <span class="typing login-text" style="font-family: Ubuntu, Helvetica, Arial, sans-serif; white-space:pre;"></span>
              </div>
            </vue-typed-js>
          </div>
        </div>
        <div class="container">

          <div class="row">
            <div class="col col-lg-2"></div>
            <div class="col-sm" style="color: #FFFFFF; text-align: left">
              <h3>My Main Projects</h3>
              <ul class="links">
                <li>
                  <a href="http://www.manoj.nz/" title="Visit tiltAdvisor webpage!" target="_blank">tiltAdvisor</a>
                  <p>
                    Venue review web application
                  </p>
                  <p>Single page application using Vue.js</p>
                  <p>RESTful API using Node.js with Express.</p>
                </li>
                <li>
                  <a href="https://csse-s302g6.canterbury.ac.nz" title="Visit Paradise Travels!" target="_blank">Personal executive travel assistant</a>

                  <p>Currently working on a travel assistant application</p>
                  <p>Play framework</p>
                </li>

              </ul>
            </div>

            <div class="col-sm" style="color: #FFFFFF; text-align: left">
              <h3>Me around the web</h3>
              <ul class="links">
                <li><a href="https://github.com/Manoj-Paladugu" title="Visit my GitHub profile" target="_blank">GitHub</a> </li>
                <li><a href="https://www.linkedin.com/in/manoj-paladugu-515938170/" title="Visit my LinkedIn profile" target="_blank">LinkedIn</a></li>
              </ul>
            </div>
            <div class="col col-lg-2"></div>
          </div>
        </div>

      </div>
  </div>

</template>

<script>
    export default {
        name: "Portfolio.vue",
        data  (){
          return{
            logo : "src/assets/background-wallpaper.jpg",
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

<style>
  body {
    background-image: url("./assets/background-wallpaper.jpg");
  }
  .sub-title {
    font-family: "Ubuntu", Helvetica, Arial, sans-serif;
    margin: 0;
    font-weight: 500;
    font-size: 6em;
  }
  .left-column, .right-column {
    text-align: left;
    width: 50%;
    float: left;
    padding-left: 30px;
  }

  .left-column {
    color : white;
    text-align: left;
    width: 50%;
    margin-left:55%;
    font-family: Ubuntu, Helvetica, Arial, sans-serif;

    /*float: left;*/
    /*max-width: 600px;*/
    /*padding-left: 30px;*/
  }

  .right-column {
    color : white;
    text-align: left;
    height : 0px;
    width: 50%;
    margin-left:33%;
    font-family: Ubuntu, Helvetica, Arial, sans-serif;

    /*float: left;*/
    /*max-width: 600px;*/
    /*padding-left: 30px;*/
  }

  .links {
    list-style: disc;
    font-size: 16px;
    padding: 0 0 0 20px;
  }

  .links li {
    margin-bottom: .6em;
  }

  .links p {
    margin: .6em 0 0 .5em;
  }

  /*additions*/


  *, *:before, *:after {
    box-sizing: border-box;
  }

  html, body, .flex-box, .page-wrapper {
    height: 100%;
  }

  body {
    margin: 0;
    color: #FFF;
    font: normal 16px/1.2 "Ubuntu", Helvetica, Arial, sans-serif;
    text-align: center;
    text-shadow: 0 1px #000;
    background-size: cover;
  }

  ::-moz-selection {
    background: #0277BD;
    color: #FFF;
    text-shadow: none;
  }

  ::selection {
    background-color: #0288D1;
    color: #FFF;
    text-shadow: none;
  }

  a {
    color: #F5F7FA;
    text-decoration: none;
  }

  a:hover, a:active {
    color: #999;
    outline: none;
    text-decoration: underline;
  }

  a:focus {
    outline: thin dotted;
  }

  .page-wrapper {
    background-image: linear-gradient(rgba(34, 34, 34, 0.5), rgba(0, 0, 0, 0));
  }


  .main-title, .sub-title {
    font-family: "Ubuntu", Helvetica, Arial, sans-serif;
    margin: 0;
    font-weight: 500;
    font-size: 6em;
  }

  .sub-title {
    font-size: 2em;
  }

  h3 {
    font-weight: normal;
  }

  .links {
    list-style: disc;
    font-size: 16px;
    padding: 0 0 0 20px;
  }

  .links li {
    margin-bottom: .6em;
  }

  .links p {
    margin: .6em 0 0 .5em;
  }


  @media (max-width: 660px) {
    .main-title {
      font-size: 5em;
    }

    .sub-title {
      font-size: 1.7em;
    }

  }


  @media (max-width: 550px) {
    .main-title {
      font-size: 4em;
    }

    .sub-title {
      font-size: 1.6em;
    }
  }

  @media (max-width: 450px) {
    .main-title {
      font-size: 3em;
    }

    .sub-title {
      font-size: 1.45em;
    }
  }

  @media (max-width: 360px) {
    .main-title {
      font-size: 2.5em;
    }

    .sub-title {
      font-size: 1.2em;
    }
  }




</style>
