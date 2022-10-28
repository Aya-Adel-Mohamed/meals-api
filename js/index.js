"use strict";
// Loading
$(document).ready(function () {
    $("#loading .sk-circle").fadeOut(500, function () {
        $("#loading").fadeOut(500,function(){
            $("#loading").remove();
            $("body").css("overflow", "auto");
        });
    });
});

// OPEN OR CLOSE SIDEBAR
function openCloseSideBar(){
let widthOfSideBar = $(".left").innerWidth();
let leftsideBarContent = $(".left li");
let TimeToOpen = 500;

if($("#OpenCloseIcon").attr("class") == "fa fa-align-justify"){
    $("#btnOpen").find("i").addClass("fa-solid fa-xmark").removeClass("fa fa-align-justify");
    $(".left").animate({"left":"0px"},500);
    $(".right").animate({"left":`${widthOfSideBar}px`},500);

    for(let i=0; i<= leftsideBarContent.length ;i++){
        leftsideBarContent.eq(i).animate({"opacity":"1","top":"0"},TimeToOpen);
        TimeToOpen += 200;
    }
}else{
    $("#btnOpen").find("i").addClass("fa fa-align-justify").removeClass("fa-solid fa-xmark");
    $(".left").animate({"left":`-${widthOfSideBar}px`},500);
    $(".right").animate({"left":"0"},500,function(){
    leftsideBarContent.animate({"opacity":"0","top":"300px"},500)});
}
}
$('#btnOpen').click(openCloseSideBar);

//GET DATA FROM API & DISPLAY DATA

// search meal by name API
let list = [];
async function mealsSearch(currentSearch) {
let apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${currentSearch}`)
let finalData = await apiRequest.json();
list = finalData.meals;
console.log(list);
displayMeals(finalData.meals);
return finalData;
}
mealsSearch("");

// List all meals by first letter API
async function searchLetter(searchLetter) {
let apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchLetter}`)
let finalData = await apiRequest.json();
list = finalData.meals;
console.log(list);
displayMeals(list);
}

// List all meal categories API
async function getSideBarContents(categoryList) {
let listCat = await fetch(`https://www.themealdb.com/api/json/v1/1/${categoryList}`);
listCat = await listCat.json();
return listCat;
}

// List all Categories API
async function categoryDetails(category) {
let apiRequest= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
let finalData = await apiRequest.json();
list = finalData.meals;
displayMeals(finalData.meals);
}

// List all Area API
async function areaDetails(area) {
let apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
let finalData = await apiRequest.json();
list = finalData.meals.slice(0,20);
console.log(list);
displayMeals(list);
}

// List all Ingredients API
async function IngDetails(Ing) {
let apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ing}`);
let finalData = await apiRequest.json();
list = finalData.meals;
displayMeals(finalData.meals);
}

// Lookup full meal details by id API
async function getDetails(id) {
let apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
let finalData = await apiRequest.json();
list = finalData.meals;
console.log(list);
displayDetailsOfMeal(list[0]);
}

// CHOOSE WHICH CATEGORY LIST DISPLAY
async function chooseDisplay(e) {
let categoryList = $(e.target).attr("mealsCat"); 
$("#myData").html("");
$("#search").html("");

if (categoryList == "search") {
    search();
}

if (categoryList == "categories") {
    $("#loadingCon").fadeIn(300);
    let listCat = await getSideBarContents(`${categoryList}.php`);
    list = listCat.categories.splice(0, 20);
    displayCat();
    $("#loadingCon").fadeOut(200);
}

if (categoryList == "a") {
    $("#loadingCon").fadeIn(300);
    let listArea = await getSideBarContents("list.php?a=list");
    list = listArea.meals.splice(0, 20);
    displayArea();
    $("#loadingCon").fadeOut(200);
}

if (categoryList == "i") {
    $("#loadingCon").fadeIn(300);
    let listIng = await getSideBarContents("list.php?i=list")
    list = listIng.meals.splice(0, 20);
    displayIng();
    $("#loadingCon").fadeOut(200);
}

if(categoryList  == "contact"){
    contactUs();
    
//VALIDATION FORM
const validation = {
    regexName: /^[a-zA-z][a-zA-z\s]{1,}$/,
    regexEmail:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    regexPhoneNumber: /^(002)?01[0125]\d{8}$/,
    regexAge: /^([1-9][0-9]|100)$/,
    regexPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,

    checkValidation: function(regex,number){
        if(regex.test($(".contact-us input").eq(number).val()) == true){
            $(".contact-us input").eq(number).next().addClass("d-none");
            $(".contact-us input").eq(number).addClass("is-valid").removeClass("is-invalid");
            return true
        }
        else{
            $(".contact-us input").eq(number).next().removeClass("d-none");
            $(".contact-us input").eq(number).removeClass("is-invalid").addClass("is-invalid");
            return false
        }
  },
    checkRePassword: function () {
        if ($(".contact-us input").eq(4).val() == $(".contact-us input").eq(5).val()) {
            $(".contact-us input").eq(5).next().addClass("d-none");
            $(".contact-us input").eq(5).addClass("is-valid").removeClass("is-invalid");
            return true
        }
        else{
            $(".contact-us input").eq(5).next().removeClass("d-none");
            $(".contact-us input").eq(5).removeClass("is-invalid").addClass("is-invalid");
            return false
        }
  },

}
let {regexName,regexEmail,regexPhoneNumber,regexAge,regexPassword} = validation;

$("form").keyup(function () {
    if(validation.checkValidation(regexName, 0) && validation.checkValidation(regexEmail, 1) && validation.checkValidation(regexPhoneNumber, 2) &&
    validation.checkValidation(regexAge, 3) && validation.checkValidation(regexPassword, 4) &&
    validation.checkRePassword()){
        $("#submit").attr("disabled", false);
    }
    else{
        $("#submit").attr("disabled", true); 
    }
});
}}

$(".navbar-link a").click(chooseDisplay);

// DISPLAY MEALS BY GET ID OF MEAL
function displayMeals(meal) {
    $("#loadingCon").fadeIn(300);
    let cartona = "";
    for (let i = 0; i < meal.length; i++) {
        cartona += `
        <div class="col-md-6 col-lg-3 my-3 shadow text-center">
            <div class="rounded" onclick="getDetails('${meal[i].idMeal}')">
                <div class="content position-relative shadow overflow-hidden">
                <img src='${meal[i].strMealThumb}' class="w-100 rounded"/>
                <div class="layer rounded d-flex align-items-center">
                     <div>
                        <h2>${meal[i].strMeal}</h2>
                    </div>
                </div>
                </div>
            </div>
        </div>`
    }
    $("#myData").html(cartona);
    $("#loadingCon").fadeOut(200);
}

// DISPLAY CAT
function displayCat() {
    let cartona = "";
    for (var i = 0; i < list.length; i++) cartona += `
    <div class="col-md-6 col-lg-3 my-3 shadow text-center">
            <div class="position-relative pb-2 shadow overflow-hidden content" onclick="categoryDetails('${list[i].strCategory}')">
                <img src='${list[i].strCategoryThumb}' class="w-100 rounded"/>
                <div class="layer rounded">
                    <div class="mt-0">
                        <h2>${list[i].strCategory}</h2>
                        <p>${list[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
    </div>`
    $("#myData").html(cartona);
}

// DISPLAY AREA
function displayArea() {
    let cartona = "";
    for (var i = 0; i < list.length; i++) cartona += `
    <div class="col-md-6 col-lg-3 my-3 shadow text-center">
        <div class="rounded position-relative shadow overflow-hidden content pb-2">
            <div onclick=(areaDetails('${list[i].strArea}'))>
                <i class="fa-solid fa-city fa-3x pb-1"></i>
                <h2 class="text-white">${list[i].strArea}</h2>
            </div>
        </div>
    </div>`
    $("#myData").html(cartona); 
}

// DISPLAY INGREDIENT
function displayIng() {
    let cartona = "";
    for (var i = 0; i < list.length; i++) cartona += `
    <div class="col-md-6 col-lg-3 my-3 p-1 shadow text-center"> 
        <div class="shadow rounded" onclick="IngDetails('${list[i].strIngredient}')">
            <div class="pb-2 px-2">
                <i class="fa-solid fa-bowl-food fa-3x"></i>
                <h2 class="text-white">${list[i].strIngredient}</h2>
                <p class="text-white">${list[i].strDescription.split(" ").splice(0,20).join(" ")}</p>
            </div>
        </div>
    </div>`
    $("#myData").html(cartona);
}

// SEARCH
async function search(){
$("#search").html(`
    <div class="row gy-2 gx-5 text-center">
        <div class="col-md-6">
            <input type="search" class="form-control" placeholder="Search By Name" id="searchByName">
        </div>
        <div class="col-md-6">
            <input type="search" class="form-control" placeholder="search By First Letter..." id="searchByFirstLetter">
        </div>
    </div>`
);

$("#searchByName").keyup(function() {
let currentSearch = $(this).val();
console.log(currentSearch);
mealsSearch(currentSearch)});

$("#searchByFirstLetter").keyup(function() {
let letter = $(this).val();
console.log(letter);
searchLetter(letter)});
}

// DISPLAY DETAILS OF MEAL
function displayDetailsOfMeal(Details) {
$("#loadingCon").fadeIn(300);
let cartona = `
    <div class="col-md-4 text-white">
		<img class="w-100" src="${Details.strMealThumb}" alt="">
		<h1 class="text-center">${Details.strMeal}</h1>
	</div>
	<div class="col-md-8 text-white text-left">
		<h2>Instructions</h2>
		<p>${Details.strInstructions}</p>
		<p><span class="fw-bolder fs-6">Area :</span> ${Details.strArea}</p>
		<p><span class="fw-bolder fs-6">Category :</span> ${Details.strCategory}</p>
		<h3>Recipes :</h3>
		<ul class="d-flex flex-wrap list-unstyled" id="recipes">
		</ul>
        <h3 class="mx-1 my-2">Tags :</h3>
		<ul class="d-flex flex-wrap list-unstyled" id="tags">
		</ul>
        <a href="${Details.strSource}" target="_blank" class="btn btn-success text-white">Source</a>
		<a href="${Details.strYoutube}" target="_blank" class="btn btn-red youtube text-white">Youtub</a>
	</div>`
$("#myData").html(cartona);
getRecipe(Details);
getTags(Details);
$("#loadingCon").fadeOut(200);
}

function getRecipe(recipe){
    let recipes = '';
    for (let i = 1; i <= 20 ; i++) {
        if(recipe[`strIngredient${i}`]){
            recipes += `<li class="my-3 mx-1 px-2 py-1 alert alert-success rounded">${recipe[`strMeasure${i}`]} ${recipe[`strIngredient${i}`]}</li>`
        }
    }
     $("#recipes").html(recipes);
}

function getTags(tags){
    let tag ='';
    let strTags = tags.strTags?.split(',');
    if(strTags){
    for (let i = 0; i < strTags.length; i++) {
        if(strTags){
            tag += `<li class="my-3 mx-1 py-1 px-2 alert alert-danger rounded">${strTags[i]}</li>` 
        }
    }
    $("#tags").html(tag);
}
}

// CONTACT US
function contactUs(){
    $("#myData").html(`
    <section class="contact-us mb-5 px-5" id="contactUs">
            <div class="container w-75 text-center">
               <h2>Contact Us...</h2>
               <form id="formData">
                  <div class="row mt-4 gy-3">
                     <div class="col-md-6">
                        <div class="form-content">
                           <input type="text" placeholder="Enter Your Name" class="form-control" name="name"/>
                           <p class="alert alert-danger p-2 d-none">Special Characters and Numbers not allowed</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="form-content">
                           <input type="email" placeholder="Enter Email" class="form-control"name="email"/>
                           <p class="alert alert-danger p-2 d-none">Enter valid email. *Ex: xxx@yyy.zzz</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="form-content">
                           <input type="tel" placeholder="Enter Phone" class="form-control" name="tel"/>
                           <p class="alert alert-danger p-2  d-none">Enter valid Phone Number</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="form-content">
                           <input type="number" placeholder="Enter Age" class="form-control" name="number"/>
                           <p class="alert alert-danger p-2  d-none">Enter valid Age</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="form-content">
                           <input type="password" placeholder="Enter Password" class="form-control"name="password"/>
                           <p class="alert alert-danger p-2  d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="form-content">
                           <input type="password" placeholder="Enter RePassword" class="form-control"/>
                           <p class="alert alert-danger p-2 d-none">Enter valid Repassword</p>
                        </div>
                     </div>
                  </div>
                  <button type="submit" class="btn btn-outline-danger mt-4" id="submit" disabled>Submit</button>
               </form>
            </div>
         </section>
    `)
}