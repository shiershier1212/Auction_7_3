//页面加载时。执行方法
window.onload = setUserInfo


let user={
    // nowLoginUserId:3,
    name:"用户名字",
    phone_number: localStorage["nowLoginUserPhoneNumber"],
    money:"10000",
}

//初始化用户信息的方法
function setUserInfo(){
    axios.get("http://localhost:8081/users/" + localStorage["nowLoginUserPhoneNumber"])
            .then(res => {
                console.log(res)
                user.name = res.data.data.name
                user.money = res.data.data.money
            })
            .catch(res => {
                console.log(res)
            })
}

let accountapp = new Vue({
    el:"#accountapp",
    data:{
        user:user,
    },
    methods: {
        setUserInfo,
        outLogin(){
          window.location.href="login.html"
        },
    },
})

function test(){
    user.money++
}
