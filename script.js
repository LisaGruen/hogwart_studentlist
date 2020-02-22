const allStudents = [];
const studentName = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  image: null
};

//Fetch info from Json and clean data
fetch("https://petlatkea.dk/2020/hogwarts/students.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // the function has only one statement, and the statement returns a value
    data.forEach(jsonObject => {
      console.log(jsonObject);
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
      } else if (fullname.length == 4) {
        student.middleName = capitalizeFirstLetter(fullname[1]);
        student.lastName = capitalizeFirstLetter(fullname[3]);
        student.nickName = capitalizeFirstLetter(fullname[2]);
      }
      // pushing repaired arrays into a string
      allStudents.push(student);
    });
    // for each array doing this function
    allStudents.forEach(showStudents);
  });

//capitalize first letter
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Show student
function showStudents(studentName) {
  console.log(studentName);

  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  const modal = document.querySelector(".modal-background");
  copy.querySelector(".firstName").textContent = studentName.firstName;
  copy.querySelector(".middleName").textContent = studentName.middleName;
  copy.querySelector(".nickName").textContent = studentName.nickName;
  copy.querySelector(".lastName").textContent = studentName.lastName;
  copy.querySelector(".house").textContent = studentName.house;
  copy.querySelector(".button_details").addEventListener("click", () => {
    modal.querySelector(".modalFirstName").textContent = studentName.firstName;
    modal.querySelector(".modalMiddleName").textContent =
      studentName.middleName;
    modal.querySelector(".modalNickName").textContent = studentName.nickName;
    modal.querySelector(".modalLastName").textContent = studentName.lastName;
    modal.querySelector(".modal-house").textContent = studentName.house;
    modal.classList.remove("hide");
    changeTheme(studentName.house);
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
themeChanger.addEventListener("change", function() {
  const selected = this.value;
  changeTheme(selected);
});
