const allStudents = [];
let filteredStudents = [];
const studentName = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  image: null,
  inquiSquad: false,
  prefect: false,
  expelled: false
};

//Fetch info from Json and clean data
fetch("https://petlatkea.dk/2020/hogwarts/students.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // the function has only one statement, and the statement returns a value
    data.forEach(jsonObject => {
      //console.log(jsonObject);
      let student = Object.create(studentName);
      // defining strings from original JSON file and making data usable
      let fullname = jsonObject.fullname
        .trim()
        .toLowerCase()
        .replace(/[-""]/g, " ")
        .split(" ");
      let house = jsonObject.house.trim().toLowerCase();
      // defining repaired strings
      student.house = capitalizeFirstLetter(house);
      student.image = jsonObject.image;
      // putting info for students in the right places for new strings
      student.firstName = capitalizeFirstLetter(fullname[0]);

      if (fullname.length == 2) {
        student.lastName = capitalizeFirstLetter(fullname[1]);
      } else if (fullname.length == 3) {
        student.lastName = capitalizeFirstLetter(fullname[2]);
        student.middleName = capitalizeFirstLetter(fullname[1]);
      } else if (fullname.length == 5) {
        student.middleName = capitalizeFirstLetter(fullname[1]);
        student.lastName = capitalizeFirstLetter(fullname[4]);
        student.nickName = capitalizeFirstLetter(fullname[2]);
      }
      // pushing repaired arrays into a string
      allStudents.push(student);
    });

    renderStudents(allStudents);
  });

// Rendering students.
function renderStudents(students) {
  document.querySelector(".studentlist").innerHTML = "";

  sortStudents("lastName");

  // for each array doing this function
  students.forEach(showStudents);
}

//capitalize first letter
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Show student
function showStudents(student) {
  //  console.log(student);

  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  const modal = document.querySelector(".modal-background");
  copy.querySelector(".firstName").textContent = student.firstName;
  copy.querySelector(".middleName").textContent = student.middleName;
  copy.querySelector(".nickName").textContent = student.nickName;
  copy.querySelector(".lastName").textContent = student.lastName;
  copy.querySelector(".house").textContent = student.house;
  copy.querySelector(".button_details").addEventListener("click", () => {
    modal.querySelector(".modalFirstName").textContent = student.firstName;
    modal.querySelector(".modalMiddleName").textContent = student.middleName;
    modal.querySelector(".modalNickName").textContent = student.nickName;
    modal.querySelector(".modalLastName").textContent = student.lastName;
    modal.querySelector(".modal-house").textContent = student.house;
    modal.querySelector(".portrait").src = getPictureFileName(student);
    modal.classList.remove("hide");
    changeTheme(student.house);
  });

  document.querySelector(".studentlist").appendChild(copy);
}

//close the modal when clicked
const modalWrapper = document.querySelector(".modal-wrapper");
modalWrapper.addEventListener("click", () => {
  modal.classList.add("hide");
});

// Theme changer.
function changeTheme(theme) {
  modal.classList.remove("gryffindor", "hufflepuff", "ravenclaw", "slytherin");
  modal.classList.add(theme.toLowerCase());
}

const themeChanger = document.querySelector(".modal-background #theme");
const modal = document.querySelector(".modal-background");
/*themeChanger.addEventListener("change", function() {
  const selected = this.value;
  changeTheme(selected);
});*/

function getPictureFileName(student) {
  let fileName = student.lastName.toLowerCase() + "_";
  if (student.firstName === "Padma") {
    fileName += "padme";
  } else if (student.firstName === "Parvati") {
    fileName += "parvati";
  } else {
    fileName += student.firstName.toLowerCase()[0];
  }

  return "portraits/" + fileName + ".png";
}

//function sort the array with different parameters
// sortBy = lastName / firstName / house
function sortStudents(sortBy = "lastName") {
  allStudents.sort(function(a, b) {
    if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
    if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
    return 0;
  });
}

document.querySelector("#sortSelect").addEventListener("change", function() {
  document.querySelector(".studentlist").innerHTML = "";

  sortStudents(this.value);

  // for each array doing this function
  allStudents.forEach(showStudents);
});

// function filter by houses
const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach(filterButton =>
  filterButton.addEventListener("click", function() {
    const filterBy = this.dataset.filter;
    const value = this.dataset.value;

    if (filterBy === "house") {
      filteredStudents = allStudents.filter(
        student => student.house.toLowerCase() === value
      );
    } else if (filterBy === "status") {
      const filteredStudents = allStudents.house.filter(
        student => student.house.toLowerCase() === value
      );
    }

    renderStudents(filteredStudents);
  })
);
