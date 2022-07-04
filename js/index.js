let app = new Vue({
    el: "#app",
    data: {
        userList: [],
        loginpn: "",
        loginps: "",
        user: {
            name: "",
            phone_number: "",
            password: "",
        }
    },
    methods: {
        get() {
            let that = this
            axios.get("http://localhost:8081/users")
                .then(res => {
                    console.log(res)
                    that.userList = res.data.data
                })
                .catch(res => {
                })
        },
        getPassword() {
            if (this.loginpn === "" || this.loginps === "") {
                alert("请输入账号或者密码！")
                return
            }
            let that = this
            axios.get("http://localhost:8081/users/" + this.loginpn)
                .then(res => {
                    console.log(res)
                    // that.userList = res.data.data
                    if (res.data.data === null) {
                        alert("账号不存在！")
                        return
                    }
                    if (that.loginps === res.data.data.password) {
                        // alert("密码正确！")
                        window.location.href="account.html"
                        localStorage.nowLoginUserPhoneNumber = that.loginpn
                    } else {
                        alert("密码不正确！")
                    }
                })
                .catch(res => {
                    console.log(res)
                })
        },
        postUser() {
            if (this.user.password === "" || this.user.phone_number === "" || this.user.name === "") {
                alert("空!!!!!!!")
                return
            }
            let that = this
            axios.post("http://localhost:8081/users", this.user)
                .then(function (res) {
                    console.log(res)
                })
                .catch(res => {
                    console.log(res)
                })
        },

    }
})



