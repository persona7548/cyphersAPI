const searchUser = document.querySelector("#searchUser")
const searchUserName = document.querySelector("#searchUser-input")

function localStorageUserName(){
    localStorage.setItem("temp",searchUserName.value)
}