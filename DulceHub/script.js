$(document).ready(function () {
  let dark = false;

  $("#themeToggle").click(function () {
    $("body").toggleClass("dark-mode");

    dark = !dark;
    $("#themeToggle").text(dark ? "Light mode" : "Dark mode");
  });

  const desserts = [
    "cheesecake",
    "brownie",
    "apple pie",
    "pancakes",
    "tiramisu",
    "chocolate cake",
    "donut",
    "waffles",
    "cupcake",
    "crepes",
    "flan",
    "ice cream",
    "banana bread",
    "cookies",
    "muffin",
    "churros",
    "lemon tart",
    "carrot cake",
  ];

  let allMeals = [];

  desserts.forEach((dessert) => {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${dessert}`,
      method: "GET",
      success: function (data) {
        if (data.meals && data.meals.length > 0) {
          allMeals.push(data.meals[0]);
          renderMeals(allMeals);
        }
      },
    });
  });

  function renderMeals(meals) {
    $("#result").empty();

    meals.forEach((meal) => {
      $("#result").append(`
        <div class="card">
          <h3>${meal.strMeal}</h3>
          <img src="${meal.strMealThumb}" />
          <button class="viewBtn" data-name="${meal.strMeal}">
            View recipe
          </button>
        </div>
      `);
    });
  }

  $("#searchBtn").click(function () {
    let query = $("#dessertInput").val().toLowerCase();

    let filtered = allMeals.filter((meal) =>
      meal.strMeal.toLowerCase().includes(query),
    );

    renderMeals(filtered);
  });

  $(document).on("click", ".viewBtn", function () {
    let mealName = $(this).data("name");

    $("#result").html("<p>Loading recipe...</p>");

    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
      method: "GET",
      success: function (data) {
        if (!data.meals) {
          $("#result").html("<p>Not found</p>");
          return;
        }

        let meal = data.meals[0];

        let ingredients = [];

        for (let i = 1; i <= 20; i++) {
          let ing = meal[`strIngredient${i}`];
          let measure = meal[`strMeasure${i}`];

          if (ing && ing.trim() !== "") {
            ingredients.push(`<li>${measure} ${ing}</li>`);
          }
        }

        $("#result").html(`
          <div class="card">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" />

            <h3>Ingredients</h3>
            <ul>${ingredients.join("")}</ul>

            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>

            <button id="backBtn">Back</button>
          </div>
        `);
      },
    });
  });

  $(document).on("click", "#backBtn", function () {
    location.reload();
  });
});
