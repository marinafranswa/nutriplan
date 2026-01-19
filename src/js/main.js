/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

const sidebarMenu = document.getElementById("sidebar-overlay");
const sidebar = document.getElementById("sidebar");
const productSection = document.getElementById("products-section");
const searchSection = document.getElementById("search-filters-section");
const mealCategories = document.getElementById("meal-categories-section");
const allRecipes = document.getElementById("all-recipes-section");
const mealDetails = document.getElementById("meal-details");
const foodLog = document.getElementById("foodlog-section");
const searchInput = document.getElementById("search-input");
const productSearch = document.getElementById("product-search-input");
const productSearchBtn = document.getElementById("search-product-btn");
const barcodeInput = document.getElementById("barcode-input");
const barcodeInputBtn = document.getElementById("lookup-barcode-btn");
const loading = document.getElementById("loading");
const productModal = document.getElementById("product-detail-modal");
const appLoading = document.getElementById("app-loading-overlay");
const foodLogBtn = document.querySelectorAll(".quick-log-btn");

let productResponse = [];
let recipesArr = [];
let nutritionArr = [];

sidebar.addEventListener("click", (e) => {
  const button = e.target.closest(".nav-link");
  const btnLinks = document.querySelectorAll(".nav-link");

  btnLinks.forEach((element) => {
    element.classList.add("hover:bg-gray-50");
    element.classList.remove("bg-emerald-50", "text-emerald-700");
    element.classList.add("text-gray-600");
  });

  if (button != null) {
    const buttonText = button.querySelector("span").textContent;

    button.classList.remove("hover:bg-gray-50");
    button.classList.remove("text-gray-600");
    button.classList.add("bg-emerald-50", "text-emerald-700");

    if (buttonText == "Product Scanner") {
      //   history.pushState({}, "", "/products");
      productSection.classList.remove("hidden");
      mealCategories.classList.add("hidden");
      allRecipes.classList.add("hidden");
      searchSection.classList.add("hidden");
      foodLog.classList.add("hidden");
      mealDetails.classList.add("hidden");
    } else if (buttonText == "Food Log") {
      //   history.pushState({}, "", "/foodlog");
      foodLog.classList.remove("hidden");
      mealCategories.classList.add("hidden");
      allRecipes.classList.add("hidden");
      searchSection.classList.add("hidden");
      productSection.classList.add("hidden");
      mealDetails.classList.add("hidden");
    } else {
      //  history.pushState({}, "", "/#");
      foodLog.classList.add("hidden");
      mealCategories.classList.remove("hidden");
      allRecipes.classList.remove("hidden");
      searchSection.classList.remove("hidden");
      productSection.classList.add("hidden");
      mealDetails.classList.add("hidden");
    }
  }
});

searchInput.addEventListener("input", () => {
  if (searchInput.value != "") {
    getRecipes(searchInput.value);
    document.getElementById("recipes-count").innerHTML =
      `Showing ${recipesArr.length} recipes of "${searchInput.value}"`;
  } else {
    getRecipes();
    document.getElementById("recipes-count").innerHTML =
      `Showing ${recipesArr.length} recipes  `;
  }
});

function getBack() {
  let backBtn = document.getElementById("back-to-meals-btn");
  backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    mealCategories.classList.remove("hidden");
    allRecipes.classList.remove("hidden");
    searchSection.classList.remove("hidden");
  });
}

getRecipes();
async function getRecipes(term = "chicken") {
  try {
    appLoading.classList.remove("loading");
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/search?q=${term}&page=1&limit=25`,
    );
    let payload = await response.json();

    if (payload.message == "success") {
      recipesArr = payload.results;
      // console.log(recipesArr);

      displayRecipes();
      appLoading.classList.add("loading");
    } else {
      throw new Error(`Error fetching questions from API`);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayRecipes() {
  let cartona = ``;

  for (let i = 0; i < recipesArr.length; i++) {
    cartona += ` <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${recipesArr[i].id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${recipesArr[i].thumbnail}"
                  alt="${recipesArr[i].name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${recipesArr[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${recipesArr[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                 ${recipesArr[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
             ${recipesArr[i].instructions[0]}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                     ${recipesArr[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                     ${recipesArr[i].area}
                  </span>
                </div>
              </div>
            </div>`;
  }
  document.getElementById("recipes-grid").innerHTML = cartona;
  mealDetailPart();
  if (recipesArr.length == 0) {
    document.getElementById("recipes-grid").innerHTML =
      `<div class="flex   flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
                </div>
                <p class="text-gray-500 text-lg">No recipes found</p>
                <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
            </div>`;
  }
}

async function fetchRecipesByCategory(input = "category", value = "Chicken") {
  try {
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?${input}=${value}&page=1&limit=25`,
    );

    let payload = await response.json();

    if (payload.message == "success") {
      recipesArr = payload.results;
      // console.log(recipesArr);
      displayRecipes();
    } else {
      throw new Error(`Error fetching questions from API`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCategories() {
  try {
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/categories`,
    );
    let payload = await response.json();
    // console.log(payload);
    if (payload.message == "success") {
      let arr = payload.results;
      let cartona = ``;
      for (let i = 0; i < 12; i++) {
        cartona += `  <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category="${arr[i].name}"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid fa-drumstick-bite"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${arr[i].name}</h3>
                </div>
              </div>
            </div>`;
      }
      document.getElementById("categories-grid").innerHTML = cartona;

      getMealCategory();
    }
  } catch (error) {
    console.log(error);
  }
}
getCategories();

function getMealCategory() {
  mealCategories.addEventListener("click", (e) => {
    const button = e.target.closest(".category-card");
    if (button != null) {
      const catText = button.querySelector("h3").textContent;
      document.getElementById("recipes-count").innerHTML =
        `Showing ${recipesArr.length} ${catText} recipes  `;
      fetchRecipesByCategory("category", catText);
    }
  });
}
async function getAreas() {
  try {
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/areas`,
    );
    let payload = await response.json();
    // console.log(payload);
    if (payload.message == "success") {
      let arr = payload.results;
      let cartona = `   <button
              class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
            >
              All Recipes
            </button>
            ${arr
              .slice(0, 10)
              .map(
                (element) => `<button
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
                    >
                    ${element.name}
                    </button>`,
              )
              .join("")}
            `;

      document.querySelector(".area").innerHTML = cartona;

      searchSection.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (button != null) {
          const areaText = button.innerText;
          const areaBtn = document.querySelectorAll("button");
          areaBtn.forEach((element) => {
            element.classList.remove(
              "bg-emerald-600",
              "text-white",
              "hover:bg-emerald-700",
            );
            element.classList.add(
              "bg-gray-100",
              "text-gray-700",
              "hover:bg-gray-200",
            );
          });
          button.classList.remove(
            "bg-gray-100",
            "text-gray-700",
            "hover:bg-gray-200",
          );
          button.classList.add(
            "bg-emerald-600",
            "text-white",
            "hover:bg-emerald-700",
          );

          if (areaText == "All Recipes") {
            getRecipes();
          } else {
            fetchRecipesByCategory("area", areaText);
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
getAreas();

function mealDetailPart() {
  const meal = document.querySelectorAll(".recipe-card");
  for (let i = 0; i < meal.length; i++) {
    meal[i].addEventListener("click", () => {
      mealDetails.classList.remove("hidden");
      mealCategories.classList.add("hidden");
      allRecipes.classList.add("hidden");
      searchSection.classList.add("hidden");
      getMealId(recipesArr[i].id);
    });
  }
}

let recipesDataArr = [];
class Meal {
  constructor(values) {
    this.mealId = values.mealId;
    this.mealName = values.mealName;
    this.mealCategory = values.mealCategory;
    this.mealArea = values.mealArea;
    this.mealPic = values.mealPic;
    this.mealTags = values.mealTags;
    this.mealIngredients = values.mealIngredients;
    this.mealInstructions = values.mealInstructions;
    this.youtube = values.mealYoutube;
    this.calories = 0;
    this.carbs = 0;
    this.fats = 0;
    this.protein = 0;
    this.totalCalories = 0;
  }
  getFoodData = async (myMeal) => {
    try {
      const ingredientsArray = myMeal.mealIngredients.map(
        (element) => `${element.measure} ${element.ingredient}`,
      );

      let x = await fetch(
        "https://nutriplan-api.vercel.app/api/nutrition/analyze",
        {
          method: "POST",
          headers: {
            "x-api-key": "TnoqSMxlfv6oS8xRizEEypZ5iw5DCJ7yzn2Yu5Hw",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeName: myMeal.mealName,
            ingredients: ingredientsArray,
          }),
        },
      );

      const response = await x.json();

      if (response.success == true) {
        recipesDataArr = response.data;
      } else {
        throw new Error(`Error fetching questions from API`);
      }
      // console.log(response);
      await displayMealDetail(myMeal, recipesDataArr);
    } catch (error) {
      console.log(error);
    }
  };
}

async function getMealId(mealId) {
  try {
    let response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/${mealId}`,
    );
    let payload = await response.json();
    let result = payload.result;
    // console.log(result);

    const values = {
      mealName: result.name,
      mealId: result.id,
      mealCategory: result.category,
      mealArea: result.area,
      mealPic: result.thumbnail,
      mealTags: result.tags,
      mealIngredients: result.ingredients,
      mealInstructions: result.instructions,
      mealYoutube: result.youtube,
    };
    let myMeal = new Meal(values);

    await myMeal.getFoodData(myMeal);
  } catch (error) {
    console.log(error);
  }
}

async function displayMealDetail(myMeal, recipesDataArr) {
  myMeal.calories = recipesDataArr.perServing.calories;
  myMeal.carbs = recipesDataArr.perServing.carbs;
  myMeal.fats = recipesDataArr.perServing.fat;
  myMeal.protein = recipesDataArr.perServing.protein;
  myMeal.totalCalories = recipesDataArr.totals.calories;

  mealDetails.innerHTML = ` <div class="max-w-7xl mx-auto">
        <!-- Back Button -->
        <button
          id="back-to-meals-btn"
          class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Recipes</span>
        </button>

        <!-- Hero Section -->
        <div class="hero bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div class="relative h-80 md:h-96">
            <img
              src="${myMeal.mealPic}"
              alt="${myMeal.mealName}"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            ></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex items-center gap-3 mb-3">
                <span
                  class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                  >${myMeal.mealCategory}</span
                >
                <span
                  class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                  >${myMeal.mealArea}</span
                >
               ${myMeal.mealTags
                 .map((element) => {
                   return `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">
                      ${element}
                    </span>`;
                 })
                 .join("")}
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                ${myMeal.mealName}
              </h1>
              <div class="flex items-center gap-6 text-white/90">
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-clock"></i>
                  <span>30 min</span>
                </span>
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-utensils"></i>
                  <span id="hero-servings">4 servings</span>
                </span>
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-fire"></i>
                  <span id="hero-calories">${
                    recipesDataArr.perServing.calories
                  } cal/serving</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            id="log-meal-btn"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            data-meal-id="${myMeal.mealId}"
          >
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Log This Meal</span>
          </button>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Ingredients & Instructions -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Ingredients -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2
                class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              >
                <i class="fa-solid fa-list-check text-emerald-600"></i>
                Ingredients
                <span class="text-sm font-normal text-gray-500 ml-auto"
                  >${myMeal.mealIngredients.length} items</span
                >
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

               ${myMeal.mealIngredients

                 .map((element) => {
                   return ` <div
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                  />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${element.measure}</span>
                    ${element.ingredient}
                  </span>
                </div>
                    `;
                 })
                 .join("")}

              </div>
            </div>

            <!-- Instructions -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                    Instructions
                </h2>
            <div class="space-y-4">
                ${myMeal.mealInstructions
                  .map((element, index) => {
                    return `
                    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                        ${index + 1}
                        </div>
                        <p class="text-gray-700 leading-relaxed pt-2">
                        ${element}
                        </p>
                    </div>
                    `;
                  })
                  .join("")}
            </div>
        </div>

            <!-- Video Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2
                class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              >
                <i class="fa-solid fa-video text-red-500"></i>
                Video Tutorial
              </h2>
              <div
                class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
              >
                <iframe
                  src="${myMeal.youtube.replace("watch?v=", "embed/")}"
                  class="absolute inset-0 w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                >
                </iframe>
              </div>
            </div>
          </div>

          <!-- Right Column - Nutrition -->
          <div class="space-y-6">
            <!-- Nutrition Facts -->
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2
                class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              >
                <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                Nutrition Facts
              </h2>
              <div id="nutrition-facts-container">
                <p class="text-sm text-gray-500 mb-4">Per serving</p>

                <div
                  class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                >
                  <p class="text-sm text-gray-600">Calories per serving</p>
                  <p class="text-4xl font-bold text-emerald-600">${
                    recipesDataArr.perServing.calories
                  } </p>
                  <p class="text-xs text-gray-500 mt-1">Total: ${
                    recipesDataArr.totals.calories
                  }  cal</p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${
                      recipesDataArr.perServing.protein
                    }g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="bg-emerald-500 h-2 rounded-full"
                      style="width: ${(recipesDataArr.perServing.protein / recipesDataArr.totals.protein) * 100}%"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${
                      recipesDataArr.perServing.carbs
                    }g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="bg-blue-500 h-2 rounded-full"
                      style="width: ${(recipesDataArr.perServing.carbs / recipesDataArr.totals.carbs) * 100}%"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${
                      recipesDataArr.perServing.fat
                    }g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="bg-purple-500 h-2 rounded-full"
                      style="width: ${(recipesDataArr.perServing.fat / recipesDataArr.totals.fat) * 100}%"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${
                      recipesDataArr.perServing.fiber
                    }g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="bg-orange-500 h-2 rounded-full"
                      style="width: ${(recipesDataArr.perServing.fiber / recipesDataArr.totals.fiber) * 100}%"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${
                      recipesDataArr.perServing.sugar
                    }g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="bg-pink-500 h-2 rounded-full"
                      style="width: ${(recipesDataArr.perServing.sugar / recipesDataArr.totals.sugar) * 100}%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  getBack();
  const logBtn = document.getElementById("log-meal-btn");

  logBtn.addEventListener("click", () => {
    logging(myMeal);
    alert("your meal is saved");
  });
}

let mealList = [];

if (JSON.parse(localStorage.getItem("mealList")).length > 0) {
  mealList = JSON.parse(localStorage.getItem("mealList"));
} else {
  mealList = [];
}

function logging(myMeal) {
  const meal = {
    name: myMeal.mealName,
    id: myMeal.mealId,
    category: myMeal.mealCategory,
    thumbnail: myMeal.mealPic,
    calories: myMeal.calories,
    protein: myMeal.protein,
    carbs: myMeal.carbs,
    fat: myMeal.fats,
    totalCalories: myMeal.totalCalories,
    date: new Date().getDate(),
  };
  console.log(meal);

  mealList.push(meal);
  localStorage.setItem("mealList", JSON.stringify(mealList));
  displayLoggedMeal();
  foodLogNutrition();
}

function displayLoggedMeal() {
  if (mealList.length != 0) {
    var cartona = ``;
    for (let i = 0; i < mealList.length; i++) {
      cartona += `<div class=" space-y-3 max-h-96 overflow-y-auto">
                      <div
                        class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all"
                      >
                        <div class="flex items-center gap-4">
                          <img
                            src="${mealList[i].thumbnail}"
                            alt="${mealList[i].name}"
                            class="w-14 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <p class="font-semibold text-gray-900">${mealList[i].name}</p>
                            <p class="text-sm text-gray-500">
                              1 serving
                              <span class="mx-1">•</span>
                              <span class="text-emerald-600">Recipe</span>
                            </p>
                            <p class="text-xs text-gray-400 mt-1">3:56 PM</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-4">
                          <div class="text-right">
                            <p class="text-lg font-bold text-emerald-600">${mealList[i].calories}</p>
                            <p class="text-xs text-gray-500">kcal</p>
                          </div>
                          <div class="hidden md:flex gap-2 text-xs text-gray-500">
                            <span class="px-2 py-1 bg-blue-50 rounded">${mealList[i].protein}g P</span>
                            <span class="px-2 py-1 bg-amber-50 rounded">${mealList[i].carbs}g C</span>
                            <span class="px-2 py-1 bg-purple-50 rounded">${mealList[i].fat}g F</span>
                          </div>
                          <button
                            class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2"
                            data-index="${i}"
                          >
                            <i data-fa-i2svg=""
                              ><svg
                                class="svg-inline--fa fa-trash-can"
                                data-prefix="fas"
                                data-icon="trash-can"
                                role="img"
                                viewBox="0 0 448 512"
                                aria-hidden="true"
                                data-fa-i2svg=""
                              >
                                <path
                                  fill="currentColor"
                                  d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"
                                ></path></svg
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>`;

      document.getElementById("logged-items-list").innerHTML = cartona;
    }
    deleteMeal();
  } else {
    document.getElementById("logged-items-list").innerHTML =
      `<div class="text-center py-8 text-gray-500">
                  <i
                    class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"
                  ></i>
                  <p class="font-medium">No meals logged today</p>
                  <p class="text-sm">
                    Add meals from the Meals page or scan products
                  </p>
                </div>`;
  }
}
displayLoggedMeal();
foodLogNutrition();

function deleteMeal() {
  const removeItem = document.querySelectorAll(".remove-foodlog-item");
  for (let i = 0; i < removeItem.length; i++) {
    removeItem[i].addEventListener("click", () => {
      mealList.splice(i, 1);
      localStorage.setItem("mealList", JSON.stringify(mealList));
      displayLoggedMeal();
      foodLogNutrition();
      displayWeeklyMap();
    });
  }
}

function foodLogNutrition() {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  for (let i = 0; i < mealList.length; i++) {
    totalCalories += mealList[i].calories;
    totalFat += mealList[i].fat;
    totalProtein += mealList[i].protein;
    totalCarbs += mealList[i].carbs;
  }

  document.getElementById("Progress-bar").innerHTML =
    `    <!-- Calories Progress -->
              <div class="bg-emerald-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Calories</span
                  >
                  <span class="text-sm text-gray-500">${totalCalories} / 2000 kcal</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full"
                    style="width: ${(totalCalories / 2000) * 100 > 100 ? 100 : (totalCalories / 2000) * 100}%"
                  ></div>
                </div>
              </div>
              <!-- Protein Progress -->
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700"
                    >Protein</span
                  >
                  <span class="text-sm text-gray-500">${totalProtein} / 50 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-500 h-2.5 rounded-full"
                    style="width: ${(totalProtein / 50) * 100 > 100 ? 100 : (totalProtein / 50) * 100}%"
                  ></div>
                </div>
              </div>
              <!-- Carbs Progress -->
              <div class="bg-amber-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Carbs</span>
                  <span class="text-sm text-gray-500">${totalCarbs} / 250 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-amber-500 h-2.5 rounded-full"
                    style="width: ${(totalCarbs / 250) * 100 > 100 ? 100 : (totalCarbs / 250) * 100}%"
                  ></div>
                </div>
              </div>
              <!-- Fat Progress -->
              <div class="bg-purple-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700">Fat</span>
                  <span class="text-sm text-gray-500">${totalFat} / 65 g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full"
                    style="width:${(totalFat / 65) * 100 > 100 ? 100 : (totalFat / 65) * 100}%"
                  ></div>
                </div>
              </div>`;
}

productSearchBtn.addEventListener("click", async () => {
  loading.classList.remove("hidden");
  await getProductByName(productSearch.value);
  productSearch.value = null;
  displayProduct(productResponse);
  getFilteredProducts();
  loading.classList.add("hidden");
});

barcodeInputBtn.addEventListener("click", async () => {
  loading.classList.remove("hidden");
  await getProductByBarcode(barcodeInput.value);
  barcodeInput.value = null;
  displayProduct(productResponse);
  loading.classList.add("hidden");
});

async function getProductByName(productName) {
  try {
    let x = await fetch(
      `https://nutriplan-api.vercel.app/api/products/search?q=${productName}&page=1&limit=24`,
      {
        headers: {
          "x-api-key": "TnoqSMxlfv6oS8xRizEEypZ5iw5DCJ7yzn2Yu5Hw",
        },
      },
    );
    let payload = await x.json();
    productResponse = payload.results;
    // console.log(productResponse);
  } catch (error) {
    console.log(error);
  }
}

function getFilterProductByBtn() {
  const productCategories = document.getElementById("product-categories");
  productCategories.addEventListener("click", async (e) => {
    loading.classList.remove("hidden");
    const filterBtn = e.target.closest(".product-category-btn");
    const filterBtnText = filterBtn.innerText;
    if (filterBtn != null) {
      await getProductByName(filterBtnText);
      displayProduct(productResponse);
      loading.classList.add("hidden");
    }
  });
}
getFilterProductByBtn();
async function getProductByBarcode(barcode) {
  try {
    let x = await fetch(
      `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`,
      {
        headers: {
          "x-api-key": "TnoqSMxlfv6oS8xRizEEypZ5iw5DCJ7yzn2Yu5Hw",
        },
      },
    );
    let payload = await x.json();
    productResponse = [payload.result];
    // console.log(productResponse);
  } catch (error) {
    console.log(error);
  }
}

function displayProduct(productResponse) {
  let cartona = ``;
  for (let i = 0; i < productResponse.length; i++) {
    cartona += ` <div
                        class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                        data-barcode="${productResponse[i].barcode}"
                      >
                        <div
                          class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            src="${productResponse[i].image}"
                            alt="${productResponse[i].name}"
                            loading="lazy"
                          />
        
                          <!-- Nutri-Score Badge -->
                          <div
                            class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                          >
                            Nutri-Score ${productResponse[i].nutritionGrade}
                          </div>
        
                          <!-- NOVA Badge -->
                          <div
                            class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                            title="NOVA 2"
                          >
                            ${productResponse[i].novaGroup}
                          </div>
                        </div>
        
                        <div class="p-4">
                          <p
                            class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                          >
                            ${productResponse[i].brand}
                          </p>
                          <h3
                            class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                          >
                           ${productResponse[i].name}
                          </h3>
        
                          <div
                            class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                          >
                            <span
                              ><i class="fa-solid fa-weight-scale mr-1"></i>250g</span
                            >
                            <span
                              ><i class="fa-solid fa-fire mr-1"></i>${productResponse[i].nutrients.calories} kcal/100g</span
                            >
                          </div>
        
                          <!-- Mini Nutrition -->
                          <div class="grid grid-cols-4 gap-1 text-center">
                            <div class="bg-emerald-50 rounded p-1.5">
                              <p class="text-xs font-bold text-emerald-700">${productResponse[i].nutrients.protein} g</p>
                              <p class="text-[10px] text-gray-500">Protein</p>
                            </div>
                            <div class="bg-blue-50 rounded p-1.5">
                              <p class="text-xs font-bold text-blue-700">${productResponse[i].nutrients.carbs} g</p>
                              <p class="text-[10px] text-gray-500">Carbs</p>
                            </div>
                            <div class="bg-purple-50 rounded p-1.5">
                              <p class="text-xs font-bold text-purple-700">${productResponse[i].nutrients.fat}g</p>
                              <p class="text-[10px] text-gray-500">Fat</p>
                            </div>
                            <div class="bg-orange-50 rounded p-1.5">
                              <p class="text-xs font-bold text-orange-700">${productResponse[i].nutrients.sugar}g</p>
                              <p class="text-[10px] text-gray-500">Sugar</p>
                            </div>
                          </div>
                        </div>
                      </div>`;
  }
  document.getElementById("products-grid").innerHTML = cartona;

  getProductDetails(productResponse);
}
function getFilteredProducts() {
  productSection.addEventListener("click", (e) => {
    const button = e.target.closest(".nutri-score-filter");
    const filterCatText = button.innerText.toLowerCase();
    loading.classList.remove("hidden");
    if (button != null) {
      if (filterCatText == "all") {
        displayProduct(productResponse);
      } else {
        let filteredProducts = productResponse.filter((element) => {
          return element.nutritionGrade == filterCatText;
        });
        displayProduct(filteredProducts);
      }
    }
    loading.classList.add("hidden");
  });
}

function getProductDetails(response) {
  const cards = document.querySelectorAll(".product-card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => {
      productModal.classList.remove("hidden");
      productModal.innerHTML = `<div
                class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              >
                <div class="p-6">
                  <!-- Header -->
                  <div class="flex items-start gap-6 mb-6">
                    <div
                      class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                      <img
                        src=" ${response[i].image}"
                        alt=" ${response[i].brand}"
                        class="w-full h-full object-contain"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-emerald-600 font-semibold mb-1">
                        ${response[i].brand}
                      </p>
                      <h2 class="text-2xl font-bold text-gray-900 mb-2">
                         ${response[i].name}
                      </h2>
                      <p class="text-sm text-gray-500 mb-3">${response[i].nutrients.calories} cl</p>
    
                      <div class="flex items-center gap-3">
                        <div
                          class="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style="background-color: #03814120"
                        >
                          <span
                            class="w-8 h-8 rounded flex items-center justify-center text-white font-bold uppercase"
                            style="background-color: #038141"
                          >
                             ${response[i].nutritionGrade}
                          </span>
                          <div>
                            <p class="text-xs font-bold" style="color: #038141">
                              Nutri-Score
                            </p>
                            <p class="text-[10px] text-gray-600">Excellent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      class="close-product-modal text-gray-400 hover:text-gray-600"
                     
                    >
                      <i class="text-2xl" data-fa-i2svg=""
                        ><svg
                          class="svg-inline--fa fa-xmark"
                          data-prefix="fas"
                          data-icon="xmark"
                          role="img"
                          viewBox="0 0 384 512"
                          aria-hidden="true"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                          ></path></svg
                      ></i>
                    </button>
                  </div>
    
                  <!-- Nutrition Facts -->
                  <div
                    class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200"
                  >
                    <h3
                      class="font-bold text-gray-900 mb-4 flex items-center gap-2"
                    >
                      <i class="text-emerald-600" data-fa-i2svg=""
                        ><svg
                          class="svg-inline--fa fa-chart-pie"
                          data-prefix="fas"
                          data-icon="chart-pie"
                          role="img"
                          viewBox="0 0 576 512"
                          aria-hidden="true"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"
                          ></path></svg
                      ></i>
                      Nutrition Facts
                      <span class="text-sm font-normal text-gray-500"
                        >(per 100g)</span
                      >
                    </h3>
    
                    <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                      <p class="text-4xl font-bold text-gray-900"> ${response[i].nutrients.calories}</p>
                      <p class="text-sm text-gray-500">Calories</p>
                    </div>
    
                    <div class="grid grid-cols-4 gap-4">
                      <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            class="bg-emerald-500 h-2 rounded-full"
                            style="width: 0%"
                          ></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${response[i].nutrients.protein}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                      </div>
                      <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            class="bg-blue-500 h-2 rounded-full"
                            style="width: 4.2%"
                          ></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${response[i].nutrients.carbs}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                      </div>
                      <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            class="bg-purple-500 h-2 rounded-full"
                            style="width: 0%"
                          ></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${response[i].nutrients.fat}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                      </div>
                      <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            class="bg-orange-500 h-2 rounded-full"
                            style="width: 2.8%"
                          ></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${response[i].nutrients.sugar}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                      </div>
                    </div>
    
                    <div
                      class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200"
                    >
                      <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">0g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                      </div>
                      <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${response[i].nutrients.fiber}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                      </div>
                      <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">0g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                      </div>
                    </div>
                  </div>
    
                  <!-- Additional Info -->
    
                  <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3
                      class="font-bold text-gray-900 mb-3 flex items-center gap-2"
                    >
                      <i class="text-gray-600" data-fa-i2svg=""
                        ><svg
                          class="svg-inline--fa fa-list"
                          data-prefix="fas"
                          data-icon="list"
                          role="img"
                          viewBox="0 0 512 512"
                          aria-hidden="true"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"
                          ></path></svg
                      ></i>
                      Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">
                      OBD1 999 999 1112606 266963207 mb
                    </p>
                  </div>
    
                  <!-- Actions -->
                  <div class="flex gap-3">
                    <button
                      class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
                      data-barcode=" ${response[i].barcode}"
                    >
                      <i class="mr-2" data-fa-i2svg=""
                        ><svg
                          class="svg-inline--fa fa-plus"
                          data-prefix="fas"
                          data-icon="plus"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                          ></path></svg></i
                      >Log This Food
                    </button>
                    <button
                      class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>`;
      const closeBtn = document.querySelector(".close-product-modal");
      closeBtn.addEventListener("click", () => {
        productModal.classList.add("hidden");
      });
    });
  }
}
function showDate() {
  let today = new Date().toDateString();
  console.log(today);

  document.getElementById("foodlog-date").innerHTML = `${today}`;
}
showDate();

function displayWeeklyMap() {
  let totalCalories = 0;
  let listDate = 0;
  for (let i = 0; i < mealList.length; i++) {
    totalCalories += mealList[i].calories;
    listDate = mealList[i].date;
  }
  console.log(mealList);

  const daysArr = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  let date = new Date().getDate();
  var cartona = ``;
  for (let i = 0; i < daysArr.length; i++) {
    let todayDate = date + i;
    cartona += ` <div class="day-card text-center">
                <p class="text-xs text-gray-500 mb-1">${daysArr[i]}</p>
                <p class="text-sm font-medium text-gray-900">${todayDate}</p>
                <div class="mt-2 text-gray-300">
                  <p class="text-lg font-bold">${listDate === todayDate ? totalCalories : 0}</p>
                  <p class="text-xs">kcal</p>
                </div>
              </div>`;
  }
  document.getElementById("weekly-chart").innerHTML = cartona;
}

displayWeeklyMap();
