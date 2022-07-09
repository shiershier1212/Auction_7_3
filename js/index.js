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
                    if (res.data.data === null) {
                        this.$message.error("账号不存在，请检查账号！")
                        return
                    }
                    if (that.loginps === res.data.data.password) {
                        this.$message({message:"登录成功！",type:"success"})
                        window.location.href="account.html"
                        localStorage.nowLoginUserPhoneNumber = that.loginpn
                        localStorage.nowLoginUserId = res.data.data.id
                    } else {
                        this.$message.error("登录失败，请检查账号或者密码！")
                    }
                })
                .catch(res => {
                    console.log(res)
                    this.$message.error("请求失败！")
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
                    if(res.data.status==="ok"){
                        // this.$message({message:"登录成功！",type:"success"})
                        alert("注册成功!")

                    }else {
                        this.$message.error("注册失败！账号已经存在！"+res.data)
                    }
                })
                .catch(res => {
                    console.log(res)
                    // this.$message.error("注册失败！"+res.data)
                })
        },
    }
})



